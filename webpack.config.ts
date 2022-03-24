import path from "path";

import webpack from "webpack";
import "webpack-dev-server"

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

interface Environment {
    production: boolean
}

export default function (env: Environment): webpack.Configuration[] {
    return [
        /* Main process */
        mainConfig(env),

        /* Renderer process */
        rendererConfig(env)
    ]
}

function mainConfig(env: Environment): webpack.Configuration {
    return config(env,
        baseConfig(
            "electron-main"
        ),

        baseOutputAndEntryConfig(
            "./dist/app/main",
            {
                index: "./src/main/index.ts",
                preload: "./src/main/preload.ts",
            }
        ),

        function resolveConfig() {
            return {
                resolve: {
                    extensions: [".js", ".ts",],
                    alias: aliasHelper({
                        main: "src/main",
                    })
                }
            }
        },

        function moduleConfig() {
            return {
                module: {
                    rules: [
                        {
                            test: /\.tsx?$/,
                            use: [
                                "ts-loader"
                            ]
                        },
                    ]
                }
            }
        },
    )
}

function rendererConfig(env: Environment): webpack.Configuration {
    return config(env,
        baseConfig(
            "web"
        ),

        baseOutputAndEntryConfig(
            "./dist/app/renderer",
            {
                index: "./src/renderer/index.tsx"
            }
        ),

        function resolveConfig() {
            return {
                resolve: {
                    extensions: [".js", ".ts", ".tsx", ".css", ".scss"],
                    alias: aliasHelper({
                        renderer: "src/renderer"
                    })
                }
            }
        },

        function moduleConfig() {
            return {
                module: {
                    rules: [
                        {
                            test: /\.tsx?$/,
                            use: [
                                "ts-loader"
                            ]
                        },
                        {
                            test: /\.s[ac]ss$/,
                            use: [
                                MiniCssExtractPlugin.loader,
                                "css-loader",
                                "sass-loader"
                            ]
                        },
                        {
                            test: /\.(png|svg|jpg|jpeg|gif)$/i,
                            type: 'asset/resource',
                            generator: {
                                filename: "assets/images/[hash][ext]"
                            }
                        },
                        {
                            test: /\.(woff|woff2|eot|ttf|otf)$/i,
                            type: 'asset/resource',
                            generator: {
                                filename: "assets/fonts/[hash][ext]"
                            }
                        },
                    ]
                }
            }
        },

        function pluginsConfig() {
            return {
                plugins: [
                    new MiniCssExtractPlugin(),

                    new HtmlWebpackPlugin({
                        template: "./src/renderer/index.html",
                        filename: "index.html",
                    })
                ]
            }
        },
    )
}

type ConfigEntry
    = ((env: Environment) => webpack.Configuration) | webpack.Configuration

function config(env: Environment, ...entries: ConfigEntry[]): webpack.Configuration {
    let result: webpack.Configuration = {};

    for (let entry of entries) {
        Object.assign(result, typeof entry == "function" ? entry(env) : entry)
    }

    return result;
}

function baseConfig(target: string): ConfigEntry {
    return function (env) {
        return {
            mode: env.production ? "production" : "development",
            devtool: env.production ? false : "source-map",
            target: target,
        }
    }
}

function baseOutputAndEntryConfig(outputPath: string, entries: { [name: string]: string }): ConfigEntry {
    return function () {
        return {
            entry: entries,
            output: {
                path: absolutePathHelper(outputPath),
                clean: true,
            }
        }
    }
}

function aliasHelper(params: { [name: string]: string }): { [name: string]: string } {
    for (let param in params) {
        params[param] = absolutePathHelper(params[param])
    }

    return params;
}

function absolutePathHelper(relativePath: string): string {
    return path.resolve(__dirname, relativePath)
}
