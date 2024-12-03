
import { PrezManifest } from '@reai/prez';

import CalculatorManifest from '@reai/calculator/manifest';
import TextPadManifest from '@reai/textpad/manifest';
import TerminalManifest from '@reai/terminal/manifest';
import SalesFlowManifest from '@reai/salesflow/manifest';
import AIDevStudioManifest from '@reai/aidevstudio/manifest';
import LocalAIManifest from '@reai/localai/manifest';
import AIBrowserManifest from '@reai/aibrowser/manifest';
import ChattyAIManifest from '@reai/chattyai/manifest';
import SettingsManifest from '../components/apps/Settings/SettingsManifest';
import AppStoreManifest from '../components/apps/AppStore/AppStoreManifest';
import FileManagerManifest from '../components/apps/FileManager/FileManagerManifest';

export const defaultApps = [
  AppStoreManifest,
  AIBrowserManifest,
  SalesFlowManifest,
  ChattyAIManifest,
  LocalAIManifest,
  PrezManifest,
  AIDevStudioManifest,
  TextPadManifest,
  CalculatorManifest,
  SettingsManifest,
  TerminalManifest,
  FileManagerManifest
  
];