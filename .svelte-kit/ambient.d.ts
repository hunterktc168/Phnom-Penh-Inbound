
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const VITE_AUTH_ENABLED: string;
	export const GIT_COMMITTER_NAME: string;
	export const __MISE_ORIG_PATH: string;
	export const COREPACK_DEFAULT_TO_LATEST: string;
	export const CRAWLER_CDP_ENDPOINT: string;
	export const HTTPS_PROXY: string;
	export const KUBERNETES_PORT: string;
	export const KUBERNETES_SERVICE_PORT: string;
	export const PYTHONIOENCODING: string;
	export const no_proxy: string;
	export const npm_config_user_agent: string;
	export const CI: string;
	export const GIT_EDITOR: string;
	export const SUPERVISOR_GROUP_NAME: string;
	export const TRAE_ENV_INITIALIZED: string;
	export const __MISE_SESSION: string;
	export const HOSTNAME: string;
	export const npm_node_execpath: string;
	export const LD_LIBRARY_PATH: string;
	export const SHLVL: string;
	export const SLARDAR_DOMAIN: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const SLARDAR_BID: string;
	export const OLDPWD: string;
	export const NO_PROXY: string;
	export const NVM_BIN: string;
	export const NVM_NODEJS_ORG_MIRROR: string;
	export const RUSTUP_UPDATE_ROOT: string;
	export const SENTINEL_STORAGE__AGENT_LOG_BUCKET: string;
	export const TRAE_REGION: string;
	export const TRAE_REMOTE_SANDBOX_NAME: string;
	export const npm_package_json: string;
	export const NVM_INC: string;
	export const PIPX_BIN_DIR: string;
	export const PYENV_SHELL: string;
	export const TOOLHOST_EXTRA_ALLOWED_PATHS: string;
	export const TOOLHOST_JOB_LOG_DIR: string;
	export const TOOLHOST_RUNTIME_MODE: string;
	export const VCI_CONTAINER_EXIT_PRIORITY: string;
	export const NODE_OPTIONS: string;
	export const PAGER: string;
	export const __MISE_DIFF: string;
	export const TRAE_WORKSPACE_RESTORE_TIMEOUT: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const CFS_SOCKET: string;
	export const GOROOT: string;
	export const RUSTUP_DIST_SERVER: string;
	export const UV_NO_PROGRESS: string;
	export const COREPACK_ENABLE_STRICT: string;
	export const NPM_CONFIG_YES: string;
	export const COLOR: string;
	export const DEBUGINFOD_URLS: string;
	export const NVM_DIR: string;
	export const COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
	export const ICUBE_OFFICIAL_LARK_PLUGIN_INSTALLED: string;
	export const TRAE_PROJECT_ID: string;
	export const https_proxy: string;
	export const LOGNAME: string;
	export const MISE_SHELL: string;
	export const TRAE_REMOTE_REGION: string;
	export const http_proxy: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const CDP_USER_DATA_DIR: string;
	export const CFS_TOKEN: string;
	export const MIX_ARCHIVES: string;
	export const SWIFTLY_TOOLCHAINS_DIR: string;
	export const npm_config_registry: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const KUBERNETES_PORT_443_TCP_ADDR: string;
	export const PHPENV_ROOT: string;
	export const RUSTUP_HOME: string;
	export const CARGO_TERM_COLOR: string;
	export const TRAE_CHAT_SESSION_ID: string;
	export const TRAE_USER_MESSAGE_ID: string;
	export const VCI_CONTAINER_LAUNCH_PRIORITY: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const GOBIN: string;
	export const TOOLHOST_SPK_AUTH_MODE: string;
	export const TRAE_REMOTE_AGENT_TOKEN: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const AGENT_TOOL_HOST_IDE_DYNAMIC_CONF_FILE: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const KUBERNETES_PORT_443_TCP_PORT: string;
	export const KUBERNETES_PORT_443_TCP_PROTO: string;
	export const SENTINEL_STORAGE__AGENT_LOG_PREFIX: string;
	export const TRAE_USER_DATA_DIR: string;
	export const ICUBE_USER_DATA_DIR: string;
	export const LANG: string;
	export const SWIFTLY_BIN_DIR: string;
	export const TRAE_ENV_WORKSPACE: string;
	export const PREVIEW_PROXY_PUBLIC_PORT: string;
	export const SPK_CONFIGURE_PORT: string;
	export const SUPERVISOR_ENABLED: string;
	export const npm_lifecycle_script: string;
	export const DEBIAN_FRONTEND: string;
	export const SWIFTLY_HOME_DIR: string;
	export const GIT_TERMINAL_PROMPT: string;
	export const NODE_PATH: string;
	export const OPEN_PREVIEW_CDP_ENDPOINT: string;
	export const npm_lifecycle_event: string;
	export const BROWSER_SNAPSHOT_DIR: string;
	export const CKG_PORT: string;
	export const MCP_LOG_DIR: string;
	export const AGENT_TOOL_HOST_MCP_SERVER_CONF_FILE: string;
	export const MIX_HOME: string;
	export const PYTHONUTF8: string;
	export const BROWSERUSE_SPK_ENABLED: string;
	export const KUBERNETES_PORT_443_TCP: string;
	export const KUBERNETES_SERVICE_PORT_HTTPS: string;
	export const SUPERVISOR_SERVER_URL: string;
	export const GIT_COMMITTER_EMAIL: string;
	export const GIT_PAGER: string;
	export const SUPERVISOR_PROCESS_NAME: string;
	export const __MISE_EXE: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const JAVA_HOME: string;
	export const KUBERNETES_SERVICE_HOST: string;
	export const LC_ALL: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const CARGO_HOME: string;
	export const NVM_CD_FLAGS: string;
	export const PYENV_ROOT: string;
	export const npm_config_global_prefix: string;
	export const HTTP_PROXY: string;
	export const TOOLHOST_CWD: string;
	export const TRAE_CUSTOM_ENV_INSTALL_TIMEOUT: string;
	export const TRAE_SANDBOX_NEW_PERMISSION: string;
	export const TRAE_USER_SCOPE: string;
	export const npm_command: string;
	export const FS_SERVER_PORT: string;
	export const TRAE_REMOTE_API_SERVER: string;
	export const CFS_TRANSPORT: string;
	export const MISE_OVERRIDE_TOOL_VERSIONS_FILENAMES: string;
	export const TRAE_LANE: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		VITE_AUTH_ENABLED: string;
		GIT_COMMITTER_NAME: string;
		__MISE_ORIG_PATH: string;
		COREPACK_DEFAULT_TO_LATEST: string;
		CRAWLER_CDP_ENDPOINT: string;
		HTTPS_PROXY: string;
		KUBERNETES_PORT: string;
		KUBERNETES_SERVICE_PORT: string;
		PYTHONIOENCODING: string;
		no_proxy: string;
		npm_config_user_agent: string;
		CI: string;
		GIT_EDITOR: string;
		SUPERVISOR_GROUP_NAME: string;
		TRAE_ENV_INITIALIZED: string;
		__MISE_SESSION: string;
		HOSTNAME: string;
		npm_node_execpath: string;
		LD_LIBRARY_PATH: string;
		SHLVL: string;
		SLARDAR_DOMAIN: string;
		npm_config_noproxy: string;
		HOME: string;
		SLARDAR_BID: string;
		OLDPWD: string;
		NO_PROXY: string;
		NVM_BIN: string;
		NVM_NODEJS_ORG_MIRROR: string;
		RUSTUP_UPDATE_ROOT: string;
		SENTINEL_STORAGE__AGENT_LOG_BUCKET: string;
		TRAE_REGION: string;
		TRAE_REMOTE_SANDBOX_NAME: string;
		npm_package_json: string;
		NVM_INC: string;
		PIPX_BIN_DIR: string;
		PYENV_SHELL: string;
		TOOLHOST_EXTRA_ALLOWED_PATHS: string;
		TOOLHOST_JOB_LOG_DIR: string;
		TOOLHOST_RUNTIME_MODE: string;
		VCI_CONTAINER_EXIT_PRIORITY: string;
		NODE_OPTIONS: string;
		PAGER: string;
		__MISE_DIFF: string;
		TRAE_WORKSPACE_RESTORE_TIMEOUT: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		CFS_SOCKET: string;
		GOROOT: string;
		RUSTUP_DIST_SERVER: string;
		UV_NO_PROGRESS: string;
		COREPACK_ENABLE_STRICT: string;
		NPM_CONFIG_YES: string;
		COLOR: string;
		DEBUGINFOD_URLS: string;
		NVM_DIR: string;
		COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
		ICUBE_OFFICIAL_LARK_PLUGIN_INSTALLED: string;
		TRAE_PROJECT_ID: string;
		https_proxy: string;
		LOGNAME: string;
		MISE_SHELL: string;
		TRAE_REMOTE_REGION: string;
		http_proxy: string;
		_: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		CDP_USER_DATA_DIR: string;
		CFS_TOKEN: string;
		MIX_ARCHIVES: string;
		SWIFTLY_TOOLCHAINS_DIR: string;
		npm_config_registry: string;
		TERM: string;
		npm_config_cache: string;
		KUBERNETES_PORT_443_TCP_ADDR: string;
		PHPENV_ROOT: string;
		RUSTUP_HOME: string;
		CARGO_TERM_COLOR: string;
		TRAE_CHAT_SESSION_ID: string;
		TRAE_USER_MESSAGE_ID: string;
		VCI_CONTAINER_LAUNCH_PRIORITY: string;
		npm_config_node_gyp: string;
		PATH: string;
		GOBIN: string;
		TOOLHOST_SPK_AUTH_MODE: string;
		TRAE_REMOTE_AGENT_TOKEN: string;
		NODE: string;
		npm_package_name: string;
		AGENT_TOOL_HOST_IDE_DYNAMIC_CONF_FILE: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		KUBERNETES_PORT_443_TCP_PORT: string;
		KUBERNETES_PORT_443_TCP_PROTO: string;
		SENTINEL_STORAGE__AGENT_LOG_PREFIX: string;
		TRAE_USER_DATA_DIR: string;
		ICUBE_USER_DATA_DIR: string;
		LANG: string;
		SWIFTLY_BIN_DIR: string;
		TRAE_ENV_WORKSPACE: string;
		PREVIEW_PROXY_PUBLIC_PORT: string;
		SPK_CONFIGURE_PORT: string;
		SUPERVISOR_ENABLED: string;
		npm_lifecycle_script: string;
		DEBIAN_FRONTEND: string;
		SWIFTLY_HOME_DIR: string;
		GIT_TERMINAL_PROMPT: string;
		NODE_PATH: string;
		OPEN_PREVIEW_CDP_ENDPOINT: string;
		npm_lifecycle_event: string;
		BROWSER_SNAPSHOT_DIR: string;
		CKG_PORT: string;
		MCP_LOG_DIR: string;
		AGENT_TOOL_HOST_MCP_SERVER_CONF_FILE: string;
		MIX_HOME: string;
		PYTHONUTF8: string;
		BROWSERUSE_SPK_ENABLED: string;
		KUBERNETES_PORT_443_TCP: string;
		KUBERNETES_SERVICE_PORT_HTTPS: string;
		SUPERVISOR_SERVER_URL: string;
		GIT_COMMITTER_EMAIL: string;
		GIT_PAGER: string;
		SUPERVISOR_PROCESS_NAME: string;
		__MISE_EXE: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		JAVA_HOME: string;
		KUBERNETES_SERVICE_HOST: string;
		LC_ALL: string;
		PWD: string;
		npm_execpath: string;
		CARGO_HOME: string;
		NVM_CD_FLAGS: string;
		PYENV_ROOT: string;
		npm_config_global_prefix: string;
		HTTP_PROXY: string;
		TOOLHOST_CWD: string;
		TRAE_CUSTOM_ENV_INSTALL_TIMEOUT: string;
		TRAE_SANDBOX_NEW_PERMISSION: string;
		TRAE_USER_SCOPE: string;
		npm_command: string;
		FS_SERVER_PORT: string;
		TRAE_REMOTE_API_SERVER: string;
		CFS_TRANSPORT: string;
		MISE_OVERRIDE_TOOL_VERSIONS_FILENAMES: string;
		TRAE_LANE: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
