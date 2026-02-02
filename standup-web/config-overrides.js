import webpack from 'webpack'

export function override(config) {
	const fallback = config.resolve.fallback || {}
	Object.assign(fallback, {
		buffer: require.resolve('buffer/'),
		util: require.resolve('util/'),
		stream: require.resolve('stream-browserify'),
		crypto: require.resolve('crypto-browserify')
	})
	config.resolve.fallback = fallback
	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer']
		})
	])
	return config
}
