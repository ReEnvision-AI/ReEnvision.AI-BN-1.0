import React, { useState } from 'react';
import { useSheetStore } from '../stores/sheetStore';
import {
  Save, Upload, Download, Plus, Minus,
  AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Copy, Scissors,
  Clipboard, Undo2, Redo2, BarChart2,
  LineChart, PieChart, Image, Link, HelpCircle,
  Settings, FileText, Edit3, Table, Database,
  Layout, Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { saveToFile, loadFromFile } from '../utils/fileUtils';

export function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showChartDialog, setShowChartDialog] = useState<'bar' | 'line' | 'pie' | null>(null);
  const { 
    copySelection, 
    cutSelection, 
    paste,
    undo,
    redo,
    updateStyle,
    selectedCell,
    selectedRange,
    clear,
    save,
    load,
    exportData
  } = useSheetStore();

  const menuItems = {
    file: [
      { 
        label: 'New', 
        icon: FileText, 
        action: () => {
          if (confirm('Are you sure you want to create a new sheet? All unsaved changes will be lost.')) {
            clear();
            toast.success('Created new spreadsheet');
          }
        }
      },
      { 
        label: 'Save', 
        icon: Save, 
        action: async () => {
          try {
            await saveToFile(exportData(), 'spreadsheet.json');
            toast.success('Spreadsheet saved');
          } catch (error) {
            toast.error('Failed to save spreadsheet');
          }
        }
      },
      { 
        label: 'Open', 
        icon: Upload, 
        action: async () => {
          try {
            const data = await loadFromFile();
            load(data);
            toast.success('Spreadsheet loaded');
          } catch (error) {
            toast.error('Failed to load spreadsheet');
          }
        }
      },
      { 
        label: 'Export', 
        icon: Download, 
        action: async () => {
          try {
            await saveToFile(exportData(), 'spreadsheet.json');
            toast.success('Spreadsheet exported');
          } catch (error) {
            toast.error('Failed to export spreadsheet');
          }
        }
      },
      { 
        label: 'Print', 
        icon: Printer, 
        action: () => window.print() 
      }
    ],
    edit: [
      { 
        label: 'Copy', 
        icon: Copy, 
        action: () => {
          if (!selectedCell && !selectedRange) {
            toast.error('Please select a cell or range first');
            return;
          }
          copySelection();
          toast.success('Copied to clipboard');
        }
      },
      { 
        label: 'Cut', 
        icon: Scissors, 
        action: () => {
          if (!selectedCell && !selectedRange) {
            toast.error('Please select a cell or range first');
            return;
          }
          cutSelection();
          toast.success('Cut to clipboard');
        }
      },
      { 
        label: 'Paste', 
        icon: Clipboard, 
        action: () => {
          if (!selectedCell) {
            toast.error('Please select a destination cell');
            return;
          }
          paste();
          toast.success('Pasted from clipboard');
        }
      },
      { 
        label: 'Undo', 
        icon: Undo2, 
        action: () => {
          undo();
          toast.success('Undo successful');
        }
      },
      { 
        label: 'Redo', 
        icon: Redo2, 
        action: () => {
          redo();
          toast.success('Redo successful');
        }
      }
    ],
    insert: [
      { 
        label: 'Bar Chart', 
        icon: BarChart2, 
        action: () => setShowChartDialog('bar') 
      },
      { 
        label: 'Line Chart', 
        icon: LineChart, 
        action: () => setShowChartDialog('line') 
      },
      { 
        label: 'Pie Chart', 
        icon: PieChart, 
        action: () => setShowChartDialog('pie') 
      },
      { 
        label: 'Image', 
        icon: Image, 
        action: () => toast.success('Image insert feature coming soon') 
      },
      { 
        label: 'Link', 
        icon: Link, 
        action: () => toast.success('Link insert feature coming soon') 
      }
    ],
    format: [
      { 
        label: 'Bold', 
        icon: Bold, 
        action: () => {
          if (!selectedCell) {
            toast.error('Please select a cell first');
            return;
          }
          updateStyle(selectedCell, { bold: true });
        }
      },
      { 
        label: 'Italic', 
        icon: Italic, 
        action: () => {
          if (!selectedCell) {
            toast.error('Please select a cell first');
            return;
          }
          updateStyle(selectedCell, { italic: true });
        }
      },
      { 
        label: 'Underline', 
        icon: Underline, 
        action: () => {
          if (!selectedCell) {
            toast.error('Please select a cell first');
            return;
          }
          updateStyle(selectedCell, { underline: true });
        }
      },
      { 
        label: 'Align Left', 
        icon: AlignLeft, 
        action: () => {
          if (!selectedCell) {
            toast.error('Please select a cell first');
            return;
          }
          updateStyle(selectedCell, { align: 'left' });
        }
      },
      { 
        label: 'Align Center', 
        icon: AlignCenter, 
        action: () => {
          if (!selectedCell) {
            toast.error('Please select a cell first');
            return;
          }
          updateStyle(selectedCell, { align: 'center' });
        }
      },
      { 
        label: 'Align Right', 
        icon: AlignRight, 
        action: () => {
          if (!selectedCell) {
            toast.error('Please select a cell first');
            return;
          }
          updateStyle(selectedCell, { align: 'right' });
        }
      }
    ],
    data: [
      { 
        label: 'Sort', 
        icon: Database, 
        action: () => toast.success('Sort feature coming soon') 
      },
      { 
        label: 'Filter', 
        icon: Table, 
        action: () => toast.success('Filter feature coming soon') 
      }
    ],
    help: [
      { 
        label: 'Documentation', 
        icon: HelpCircle, 
        action: () => toast.success('Documentation coming soon') 
      },
      { 
        label: 'Settings', 
        icon: Settings, 
        action: () => toast.success('Settings coming soon') 
      }
    ]
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  return (
    <div className="flex bg-gray-900 text-white border-b border-gray-800">
      {Object.entries(menuItems).map(([menuName, items]) => (
        <div key={menuName} className="relative">
          <button
            className={`px-4 py-2 hover:bg-gray-800 ${
              activeMenu === menuName ? 'bg-gray-800' : ''
            }`}
            onClick={() => handleMenuClick(menuName)}
          >
            {menuName.charAt(0).toUpperCase() + menuName.slice(1)}
          </button>
          
          {activeMenu === menuName && (
            <div className="absolute left-0 top-full mt-1 bg-gray-800 rounded-lg shadow-lg z-50 min-w-[200px] border border-gray-700">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.action)}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700 text-left"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}