import { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BuildOptions } from "./types/types";
import { buildBabelLoader } from "./babel/buildBabelLoader";

export function buildLoaders(options: BuildOptions): ModuleOptions["rules"] {
  const { isDev } = options;

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: "asset/resource",
  };

  const svgUrlLoader = {
    test: /\.svg$/i,
    type: "asset",
    resourceQuery: /url/, // *.svg?url
  };

  const svgrLoader = {
    test: /\.svg$/,
    issuer: /\.[jt]sx?$/,
    resourceQuery: { not: [/url/] },
    use: [
      {
        loader: "@svgr/webpack",
        options: {
          icon: true,
          typescript: true,
          svgoConfig: {
            plugins: [
              {
                name: "convertColors",
                params: {
                  currentColor: true,
                },
              },
            ],
          },
        },
      },
    ],
  };

  const cssLoaderWithModules = {
    loader: "css-loader",
    options: {
      modules: {
        namedExport: false,
        exportLocalsConvention: "as-is",
        localIdentName: isDev
          ? "[path][name]__[local]--[hash:base64:5]"
          : "[hash:base64:8]",
      },
    },
  };

  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      cssLoaderWithModules,
      "sass-loader",
    ],
  };

  const babelLoader = buildBabelLoader(options);

  return [assetLoader, scssLoader, babelLoader, svgUrlLoader, svgrLoader];
}
