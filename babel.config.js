module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [".js", ".ios.js", ".android.js"],
        alias: {
          assets: "./src/assets",
          components: "./src/components",
          services: "./src/services",
          states: "./src/states",
          styles: "./src/styles",
          utils: "./src/utils",
          views: "./src/views",
        }
      }
    ]
  ]
};
