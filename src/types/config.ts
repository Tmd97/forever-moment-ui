// Configuration Type Definitions

// ============================================
// Navigation Configuration
// ============================================

export interface NavigationItem {
    id: string;
    label: string;
    path?: string;
    icon?: string;
    roles?: string[];
    permissions?: string[];
    children?: NavigationItem[];
    badge?: string | number;
    external?: boolean;
}

export interface NavigationConfig {
    admin: NavigationItem[];
}

// ============================================
// Form Configuration
// ============================================

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'file' | 'custom';

export interface FieldValidation {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string; // Name of custom validator
    message?: string;
}

export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface FormField {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    defaultValue?: any;
    validation?: FieldValidation;
    options?: SelectOption[]; // For select/radio
    disabled?: boolean;
    hidden?: boolean;
    helperText?: string;
    customRenderer?: string; // Name of custom renderer
    dependsOn?: string; // Field name this depends on
    showWhen?: any; // Condition to show field
}

export interface FormConfig {
    id: string;
    fields: FormField[];
    submitLabel?: string;
    cancelLabel?: string;
    layout?: 'vertical' | 'horizontal' | 'grid';
    columns?: number;
}

export interface FormsConfig {
    [formId: string]: FormConfig;
}

// ============================================
// Table Configuration
// ============================================

export type ColumnType = 'text' | 'number' | 'date' | 'badge' | 'boolean' | 'currency' | 'actions' | 'custom';

export interface TableColumn {
    key: string;
    header: string;
    type?: ColumnType;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: string; // Name of renderer function
    format?: string; // Format string (for dates, currency)
    className?: string;
}

export interface TableAction {
    id: string;
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    permissions?: string[];
    onClick?: string; // Name of handler function
}

export interface TableConfig {
    id: string;
    columns: TableColumn[];
    actions?: TableAction[];
    rowActions?: TableAction[];
    pagination?: boolean;
    pageSize?: number;
    searchable?: boolean;
    exportable?: boolean;
}

export interface TablesConfig {
    [tableId: string]: TableConfig;
}

// ============================================
// Route Configuration
// ============================================

export interface RouteConfig {
    path: string;
    element: string; // Component name
    auth?: 'public' | 'private' | 'protected';
    roles?: string[];
    permissions?: string[];
    children?: RouteConfig[];
    layout?: string; // Layout component name
    lazy?: boolean;
    redirect?: string;
}

export interface RoutesConfig {
    routes: RouteConfig[];
}

// ============================================
// Permission Configuration
// ============================================

export interface RolePermissions {
    permissions: string[];
    inherits?: string[]; // Inherit from other roles
}

export interface PermissionsConfig {
    roles: {
        [roleName: string]: RolePermissions;
    };
}

// ============================================
// Content/i18n Configuration
// ============================================

export interface ContentSection {
    [key: string]: string | ContentSection;
}

export interface ContentConfig {
    [locale: string]: ContentSection;
}

// ============================================
// Theme Configuration
// ============================================

export interface ThemeColors {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
}

export interface ThemeBranding {
    appName: string;
    logo?: string;
    favicon?: string;
    tagline?: string;
}

export interface ThemeConfig {
    colors: ThemeColors;
    branding: ThemeBranding;
    darkMode?: boolean;
}

// ============================================
// App Configuration (All configs combined)
// ============================================

export interface AppConfig {
    navigation: NavigationConfig;
    forms: FormsConfig;
    tables: TablesConfig;
    routes: RoutesConfig;
    permissions: PermissionsConfig;
    content: ContentConfig;
    theme: ThemeConfig;
}

// ============================================
// Config State (for Redux)
// ============================================

export interface ConfigState {
    navigation: NavigationConfig | null;
    forms: FormsConfig | null;
    tables: TablesConfig | null;
    routes: RoutesConfig | null;
    permissions: PermissionsConfig | null;
    content: ContentConfig | null;
    theme: ThemeConfig | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
}
