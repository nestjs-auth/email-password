export interface AppModuleInstantiationOptions {
	/**
	 * This will be the secret your JWT tokens are signed with. In production this should be changed.
	 */
	jwtSecret?: string,
}
