# API Companion

<div align="center">

![API Companion](resources/api-icon.svg)

A Visual Studio Code extension that helps you visualize and navigate API endpoints in your codebase.

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://marketplace.visualstudio.com/items?itemName=Monarch.api-companion)
[![Installs](https://img.shields.io/badge/installs-0-brightgreen.svg)](https://marketplace.visualstudio.com/items?itemName=Monarch.api-companion)
[![Rating](https://img.shields.io/badge/rating-★★★★★-yellow.svg)](https://marketplace.visualstudio.com/items?itemName=Monarch.api-companion)

</div>

## Features

- 🔍 **Automatic API Detection**: Automatically detects API endpoints in your TypeScript and JavaScript files
- 🚀 **Real-time Updates**: Automatically refreshes when files are created, modified, or deleted
- 📌 **Quick Navigation**: Click on any endpoint to jump directly to its definition
- 🎯 **Multiple Framework Support**: Supports various API patterns including:
  - Express.js routes (`app.get('/path')`)
  - Router definitions (`router.post('/path')`)
  - NestJS decorators (`@Get('/path')`)
  - FastAPI-style decorators

## Usage

1. Install the extension
2. Open a project containing API endpoints
3. Click on the API Companion icon in the activity bar (sidebar)
4. Browse through your API endpoints organized by file
5. Click on any endpoint to navigate to its definition

## Supported Patterns

The extension currently recognizes the following API patterns:

```typescript
// Express-style routes
app.get('/users', ...)
app.post('/users', ...)

// Router definitions
router.get('/products', ...)
router.post('/products', ...)

// NestJS decorators
@Get('/orders')
@Post('/orders')

// FastAPI-style decorators
@get('/items')
@post('/items')
```

## Features at a Glance

- ✨ Shows the number of endpoints per file
- 📝 Displays HTTP method and path for each endpoint
- 🔗 Direct link to endpoint definition in code
- 🔄 Auto-refresh on file changes
- 🎨 Clean and intuitive interface

## Requirements

- Visual Studio Code version 1.97.0 or higher
- TypeScript/JavaScript projects with API endpoints

## Extension Settings

This extension contributes the following settings:

* `api-companion.enable`: Enable/disable the API Companion
* `api-companion.refreshOnSave`: Enable/disable auto-refresh on file save

## Known Issues

None reported. If you find any issues, please report them on our [GitHub repository](https://github.com/Monarch/api-companion/issues).

## Release Notes

### 0.0.1

Initial release of API Companion:
- Basic API endpoint detection
- File system watching
- Quick navigation to endpoint definitions

## Contributing

Contributions are always welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the [MIT License](LICENSE).

---

**Enjoy!** 💻✨

Made with ❤️ by [Monarch](https://marketplace.visualstudio.com/publishers/Monarch)
