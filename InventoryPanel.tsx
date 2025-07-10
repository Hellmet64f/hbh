import React, { useState } from 'react';
import type { InventoryItem, OwnedEntity } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface InventoryPanelProps {
    inventory: InventoryItem[];
    entities: OwnedEntity[];
}

type ActiveTab = 'inventory' | 'organizations';

const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, entities }) => {
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');

    const hasContent = inventory.length > 0 || entities.length > 0;
    if (!hasContent) {
        return null;
    }

    const tabClasses = (tabName: ActiveTab) =>
        `px-4 py-2 font-bold rounded-t-lg transition-colors duration-200 focus:outline-none ${
        activeTab === tabName
            ? 'bg-gray-700 text-purple-300'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700/50'
        }`;

    return (
        <div className="mt-6 bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 shadow-xl animate-fade-in">
            <div className="flex border-b border-gray-700">
                {inventory.length > 0 && (
                    <button onClick={() => setActiveTab('inventory')} className={tabClasses('inventory')}>
                        {t('inventoryTab')}
                    </button>
                )}
                 {entities.length > 0 && (
                    <button onClick={() => setActiveTab('organizations')} className={tabClasses('organizations')}>
                        {t('organizationsTab')}
                    </button>
                )}
            </div>
            <div className="p-4">
                {activeTab === 'inventory' && inventory.length > 0 && (
                    <div className="max-h-48 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="p-2 text-sm font-semibold text-purple-400 uppercase tracking-wider">{t('itemHeader')}</th>
                                    <th className="p-2 text-sm font-semibold text-purple-400 uppercase tracking-wider text-center">{t('quantityHeader')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item) => (
                                <tr key={item.name} className="border-t border-gray-700">
                                    <td className="p-2">
                                        <p className="font-bold text-gray-200">{item.name}</p>
                                        <p className="text-sm text-gray-400 italic">{item.description}</p>
                                    </td>
                                    <td className="p-2 text-center text-lg font-bold text-gray-300">{item.quantity}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'organizations' && entities.length > 0 && (
                     <div className="max-h-48 overflow-y-auto space-y-4">
                        {entities.map(entity => (
                            <div key={entity.name} className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                                <h4 className="font-bold text-lg text-purple-300">{entity.name}</h4>
                                <p className="text-sm text-gray-400 mb-2">{t('typeHeader')}: {entity.type}</p>
                                <div>
                                    <h5 className="font-semibold text-gray-300">{t('rolesHeader')}:</h5>
                                    <ul className="list-disc list-inside text-gray-400 pl-2">
                                        {entity.roles.map(role => (
                                            <li key={role.role}>
                                                <span className="font-semibold">{role.role}:</span> {role.person}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                     </div>
                )}
            </div>
        </div>
    );
};

export default InventoryPanel;
