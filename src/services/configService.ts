import type {
    NavigationConfig,
    FormsConfig,
    TablesConfig,
    RoutesConfig,
    PermissionsConfig,
    ContentConfig,
    ThemeConfig,
    AppConfig,
} from '@/types/config';

/**
 * Configuration Service
 * Handles fetching and caching of application configurations
 * Can be extended to fetch from backend API
 */

const CONFIG_CACHE_KEY = 'app_config_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

class ConfigService {
    private cache: Map<string, { data: any; timestamp: number }> = new Map();

    /**
     * Fetch configuration from backend or local files
     * Currently uses local imports, can be replaced with API calls
     */
    private async fetchFromSource<T>(configName: string): Promise<T> {
        // TODO: Replace with actual API calls
        // For now, import from local JSON files
        try {
            const config = await import(`@/config/${configName}.json`);
            return config.default || config;
        } catch (error) {
            console.error(`Failed to load config: ${configName}`, error);
            throw new Error(`Configuration ${configName} not found`);
        }
    }

    /**
     * Get cached config or fetch if expired
     */
    private async getConfig<T>(configName: string, forceRefresh = false): Promise<T> {
        const cached = this.cache.get(configName);
        const now = Date.now();

        if (!forceRefresh && cached && now - cached.timestamp < CACHE_DURATION) {
            return cached.data as T;
        }

        const data = await this.fetchFromSource<T>(configName);
        this.cache.set(configName, { data, timestamp: now });

        // Persist to localStorage for offline support
        this.persistToStorage(configName, data);

        return data;
    }

    /**
     * Persist config to localStorage
     */
    private persistToStorage(configName: string, data: any): void {
        try {
            const stored = JSON.parse(localStorage.getItem(CONFIG_CACHE_KEY) || '{}');
            stored[configName] = { data, timestamp: Date.now() };
            localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to persist config to storage', error);
        }
    }

    /**
     * Public API Methods
     */

    async getNavigationConfig(forceRefresh = false): Promise<NavigationConfig> {
        return this.getConfig<NavigationConfig>('navigation', forceRefresh);
    }

    async getFormsConfig(forceRefresh = false): Promise<FormsConfig> {
        return this.getConfig<FormsConfig>('forms', forceRefresh);
    }

    async getTablesConfig(forceRefresh = false): Promise<TablesConfig> {
        return this.getConfig<TablesConfig>('tables', forceRefresh);
    }

    async getRoutesConfig(forceRefresh = false): Promise<RoutesConfig> {
        return this.getConfig<RoutesConfig>('routes', forceRefresh);
    }

    async getPermissionsConfig(forceRefresh = false): Promise<PermissionsConfig> {
        return this.getConfig<PermissionsConfig>('permissions', forceRefresh);
    }

    async getContentConfig(forceRefresh = false): Promise<ContentConfig> {
        return this.getConfig<ContentConfig>('content', forceRefresh);
    }

    async getThemeConfig(forceRefresh = false): Promise<ThemeConfig> {
        return this.getConfig<ThemeConfig>('theme', forceRefresh);
    }

    /**
     * Load all configurations at once
     */
    async getAllConfigs(forceRefresh = false): Promise<AppConfig> {
        const [navigation, forms, tables, routes, permissions, content, theme] = await Promise.all([
            this.getNavigationConfig(forceRefresh),
            this.getFormsConfig(forceRefresh),
            this.getTablesConfig(forceRefresh),
            this.getRoutesConfig(forceRefresh),
            this.getPermissionsConfig(forceRefresh),
            this.getContentConfig(forceRefresh),
            this.getThemeConfig(forceRefresh),
        ]);

        return {
            navigation,
            forms,
            tables,
            routes,
            permissions,
            content,
            theme,
        };
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
        localStorage.removeItem(CONFIG_CACHE_KEY);
    }

    /**
     * Invalidate specific config
     */
    invalidateConfig(configName: string): void {
        this.cache.delete(configName);
    }
}

// Export singleton instance
export const configService = new ConfigService();
