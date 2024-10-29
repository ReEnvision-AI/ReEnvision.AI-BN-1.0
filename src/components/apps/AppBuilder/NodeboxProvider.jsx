import { useEffect, useState, useCallback } from 'react';
import { Nodebox } from '@codesandbox/nodebox';
import { NodeboxError as NodeboxErrorComponent } from './components/NodeboxError';
import { NodeboxLoader } from './components/NodeboxLoader';
import { NodeboxStatus, NodeboxErrorType, NodeboxError } from './services/nodeboxStatus';

const INITIALIZATION_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export function NodeboxProvider({ children }) {
  const [nodeboxInstance, setNodeboxInstance] = useState(null);
  const [status, setStatus] = useState(NodeboxStatus.INITIALIZING);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const createNodeboxIframe = useCallback(() => {
    const iframe = document.createElement('iframe');
    iframe.id = 'nodebox-iframe';
    iframe.style.display = 'none';
    iframe.setAttribute('title', 'Nodebox Runtime');
    iframe.setAttribute('aria-hidden', 'true');
    return iframe;
  }, []);

  const cleanupExistingNodebox = useCallback(() => {
    const existingIframe = document.querySelector('#nodebox-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }
    if (nodeboxInstance) {
      nodeboxInstance.destroy();
      setNodeboxInstance(null);
    }
  }, [nodeboxInstance]);

  const initializeNodebox = useCallback(async () => {
    let iframe = null;
    
    try {
      setStatus(NodeboxStatus.INITIALIZING);
      cleanupExistingNodebox();

      iframe = createNodeboxIframe();
      document.body.appendChild(iframe);

      const instance = await Promise.race([
        new Nodebox({
          iframe,
          runtimeUrl: 'https://nodebox-runtime.codesandbox.io'
        }).connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new NodeboxError(
            'Connection timed out',
            NodeboxErrorType.TIMEOUT
          )), INITIALIZATION_TIMEOUT)
        )
      ]);

      setNodeboxInstance(instance);
      setStatus(NodeboxStatus.READY);
      setError(null);
    } catch (err) {
      console.warn('Nodebox initialization failed:', err);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(initializeNodebox, RETRY_DELAY);
      } else {
        setStatus(NodeboxStatus.ERROR);
        setError(new NodeboxError(
          'Failed to initialize development environment',
          NodeboxErrorType.INITIALIZATION,
          err
        ));
      }

      if (iframe) {
        iframe.remove();
      }
    }
  }, [retryCount, cleanupExistingNodebox, createNodeboxIframe]);

  useEffect(() => {
    initializeNodebox();

    return () => {
      cleanupExistingNodebox();
      setStatus(NodeboxStatus.DESTROYED);
    };
  }, [initializeNodebox, cleanupExistingNodebox]);

  const handleRetry = useCallback(() => {
    setError(null);
    setRetryCount(0);
    initializeNodebox();
  }, [initializeNodebox]);

  if (status === NodeboxStatus.ERROR) {
    return <NodeboxErrorComponent error={error} onRetry={handleRetry} />;
  }

  if (status !== NodeboxStatus.READY) {
    return <NodeboxLoader retryCount={retryCount} maxRetries={MAX_RETRIES} />;
  }

  return children(nodeboxInstance);
}