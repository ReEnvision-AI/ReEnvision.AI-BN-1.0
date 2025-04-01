import CalculatorManifest from '@reai/calculator/manifest';
import TextPadManifest from '@reai/textpad/manifest';
import TerminalManifest from '@reai/terminal/manifest';
import SalesFlowManifest from '@reai/salesflow/manifest';
import AIDevStudioManifest from '@reai/aidevstudio/manifest';
import LocalAIManifest from '@reai/localai/manifest';
import AIBrowserManifest from '@reai/aibrowser/manifest';
import ChattyAIManifest from '@reai/chattyai/manifest';

CalculatorManifest.url = 'https://reai-apps.vercel.app/calculator';

export const AVAILABLE_APPS = [
  AIBrowserManifest,
  SalesFlowManifest,
  ChattyAIManifest,
  LocalAIManifest,
  AIDevStudioManifest,
  TextPadManifest,
  CalculatorManifest,
  TerminalManifest,
];
