module.exports = {
	apps: [
		{
			name: "vov-client",
			script: "npm",
			args: "run dev",
			env_production: {
				NODE_ENV: "production",
			},
			env_development: {
				NODE_ENV: "development",
			},
		},
	],
};