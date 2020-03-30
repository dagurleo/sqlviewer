"use strict";
exports.__esModule = true;
var vscode = require("vscode");
var path = require("path");
var ReactPanel = /** @class */ (function () {
    function ReactPanel(extensionPath) {
        var _this = this;
        this._disposables = [];
        this._extensionPath = extensionPath;
        // Create and show a new webview panel
        this._panel = vscode.window.createWebviewPanel(ReactPanel.viewType, 'React', vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restric the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.file(path.join(this._extensionPath, 'build'))
            ]
        });
        // Set the webview's initial html content
        this._panel.webview.html = this._getHtmlForWebview();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(function () { return _this.dispose(); }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(function (message) {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    ReactPanel.createOrShow = function (extensionPath) {
        var column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        // Otherwise, create a new panel.
        console.log(column);
        console.log('react panel', ReactPanel.currentPanel);
        if (ReactPanel.currentPanel) {
            ReactPanel.currentPanel._panel.reveal(column);
        }
        else {
            console.log('wowooww');
            ReactPanel.currentPanel = new ReactPanel(extensionPath);
            console.log(ReactPanel.currentPanel);
        }
    };
    ReactPanel.prototype.doRefactor = function () {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    };
    ReactPanel.prototype.dispose = function () {
        ReactPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            var x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    };
    ReactPanel.prototype._getHtmlForWebview = function () {
        var manifest = require(path.join(this._extensionPath, 'build', 'asset-manifest.json'));
        var mainScript = manifest['main.js'];
        var mainStyle = manifest['main.css'];
        var scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'build', mainScript));
        var scriptUri = scriptPathOnDisk["with"]({ scheme: 'vscode-resource' });
        var stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'build', mainStyle));
        var styleUri = stylePathOnDisk["with"]({ scheme: 'vscode-resource' });
        // Use a nonce to whitelist which scripts can be run
        var nonce = getNonce();
        console.log(scriptUri);
        return "<!DOCTYPE html>\n\t\t\t<html lang=\"en\">\n\t\t\t<head>\n\t\t\t\t<meta charset=\"utf-8\">\n\t\t\t\t<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,shrink-to-fit=no\">\n\t\t\t\t<meta name=\"theme-color\" content=\"#000000\">\n\t\t\t\t<title>React App</title>\n\t\t\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"" + styleUri + "\">\n\t\t\t\t<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-" + nonce + "';style-src vscode-resource: 'unsafe-inline' http: https: data:;\">\n\t\t\t\t<base href=\"" + vscode.Uri.file(path.join(this._extensionPath, 'build'))["with"]({
            scheme: 'vscode-resource'
        }) + "/\">\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t\t<noscript>You need to enable JavaScript to run this app.</noscript>\n\t\t\t\t<div id=\"root\"></div>\n\t\t\t\t\n\t\t\t\t<script nonce=\"" + nonce + "\" src=\"" + scriptUri + "\"></script>\n      </body>\n      <script>\n      setInterval(() => {console.log('hello')}, 1000)\n      </script>\n      </html>";
    };
    ReactPanel.viewType = 'react';
    return ReactPanel;
}());
exports["default"] = ReactPanel;
function getNonce() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
