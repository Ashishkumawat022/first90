module: {
    rules: [
        {
            test: /\.scss$/,
            include: path.join(__dirname, 'src'),
            user: [
                'style-loader',
                {
                    loader: 'typings-for-css-modules-loader',
                    options: {
                        modules: true,
                        namedExport: true
                    }
                }
            ]
        },
    ];
}