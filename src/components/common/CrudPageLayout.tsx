import type { ReactNode } from 'react';

interface CrudPageLayoutProps {
    /** Filter component slot */
    filterSlot?: ReactNode;
    /** Add button slot */
    addButton?: ReactNode;
    /** DataTable slot */
    tableSlot: ReactNode;
    /** SidePanel slot */
    sidePanelSlot?: ReactNode;
    /** Modal slot (create/edit form) */
    modalSlot?: ReactNode;
    /** Delete confirmation modal slot */
    deleteModalSlot?: ReactNode;
    /** Container class name */
    className?: string;
}

export const CrudPageLayout = ({
    filterSlot,
    addButton,
    tableSlot,
    sidePanelSlot,
    modalSlot,
    deleteModalSlot,
    className,
}: CrudPageLayoutProps) => {
    return (
        <div className={className}>
            <div className='px-6 pt-4 pb-4 shrink-0'>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    {filterSlot}
                    {addButton}
                </div>
            </div>
            <div className="flex flex-1 min-h-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    {tableSlot}
                </div>
                {sidePanelSlot}
            </div>
            {modalSlot}
            {deleteModalSlot}
        </div>
    );
};
