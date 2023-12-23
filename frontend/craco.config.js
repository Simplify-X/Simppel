import CracoLessPlugin from 'craco-less';

export const plugins = [
    {
        plugin: CracoLessPlugin,
        options: {
            lessLoaderOptions: {
                lessOptions: {
                    modifyVars: { '@primary-color': '#1DA57A' }, // Add your theme variables here
                    javascriptEnabled: true,
                },
            },
        },
    },
];
