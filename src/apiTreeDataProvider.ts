import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class ApiItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly description?: string,
        public readonly tooltip?: string,
        public readonly filePath?: string,
        public readonly lineNumber?: number,
        public readonly type: 'file' | 'endpoint' = 'endpoint'
    ) {
        super(label, collapsibleState);
        this.description = description;
        this.tooltip = tooltip;
        
        // Set icons based on item type
        if (type === 'file') {
            this.iconPath = new vscode.ThemeIcon('code');
            this.contextValue = 'apiFile';
        } else {
            // Set method-specific icons for endpoints
            const method = label.split(' ')[0].toLowerCase();
            let icon: string;
            switch (method) {
                case 'get':
                    icon = 'search';
                    break;
                case 'post':
                    icon = 'diff-added';
                    break;
                case 'put':
                    icon = 'edit';
                    break;
                case 'delete':
                    icon = 'trash';
                    break;
                case 'patch':
                    icon = 'diff-modified';
                    break;
                default:
                    icon = 'symbol-event';
            }
            this.iconPath = new vscode.ThemeIcon(icon);
            this.contextValue = 'apiEndpoint';
        }

        // Add command to open file at specific line
        if (lineNumber !== undefined) {
            this.command = {
                command: 'vscode.open',
                arguments: [vscode.Uri.file(filePath || ''), { selection: new vscode.Range(lineNumber, 0, lineNumber, 0) }],
                title: 'Open API Endpoint'
            };
        }
    }
}

interface ApiEndpoint {
    method: string;
    path: string;
    lineNumber: number;
    description?: string;
}

export class ApiTreeDataProvider implements vscode.TreeDataProvider<ApiItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ApiItem | undefined | null | void> = new vscode.EventEmitter<ApiItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ApiItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ApiItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ApiItem): Promise<ApiItem[]> {
        if (!this.workspaceRoot) {
            return Promise.resolve([]);
        }

        if (!element) {
            // Root level - show project files with potential API endpoints
            return this.getApiFiles();
        } else {
            // Show API endpoints for the selected file
            return this.getApiEndpoints(element.filePath || '');
        }
    }

    private async getApiFiles(): Promise<ApiItem[]> {
        if (!this.workspaceRoot) {
            return [];
        }

        const apiFiles: ApiItem[] = [];
        const patterns = ['**/*.ts', '**/*.js'];
        
        for (const pattern of patterns) {
            const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
            
            for (const file of files) {
                const relativePath = path.relative(this.workspaceRoot, file.fsPath);
                const endpoints = await this.getApiEndpoints(file.fsPath);
                
                if (endpoints.length > 0) {
                    apiFiles.push(new ApiItem(
                        path.basename(relativePath),
                        vscode.TreeItemCollapsibleState.Collapsed,
                        `${endpoints.length} endpoint${endpoints.length === 1 ? '' : 's'}`,
                        `${relativePath}\n${endpoints.length} API endpoint${endpoints.length === 1 ? '' : 's'}`,
                        file.fsPath,
                        undefined,
                        'file'
                    ));
                }
            }
        }

        // Sort files alphabetically
        return apiFiles.sort((a, b) => a.label.localeCompare(b.label));
    }

    private async getApiEndpoints(filePath: string): Promise<ApiItem[]> {
        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            const endpoints: ApiEndpoint[] = [];
            
            // Match common API patterns
            const patterns = [
                // Express-style routes
                /\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`](?:[^)]*\/\*\s*([^*]*)\s*\*\/)?/g,
                // Router definitions
                /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`](?:[^)]*\/\*\s*([^*]*)\s*\*\/)?/g,
                // Controller decorators (NestJS style)
                /@(Get|Post|Put|Delete|Patch)\s*\(\s*['"`]([^'"`]+)['"`](?:[^)]*\/\*\s*([^*]*)\s*\*\/)?/g,
                // FastAPI style
                /@(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`](?:[^)]*\/\*\s*([^*]*)\s*\*\/)?/g
            ];

            for (const pattern of patterns) {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    const method = match[1].toUpperCase();
                    const path = match[2];
                    const description = match[3]?.trim();
                    const lineNumber = content.substring(0, match.index).split('\n').length - 1;
                    
                    endpoints.push({ method, path, lineNumber, description });
                }
            }

            // Sort endpoints by method and path
            endpoints.sort((a, b) => {
                const methodOrder = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
                const methodCompare = methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);
                return methodCompare !== 0 ? methodCompare : a.path.localeCompare(b.path);
            });

            return endpoints.map(endpoint => {
                const label = `${endpoint.method} ${endpoint.path}`;
                const description = endpoint.description;
                return new ApiItem(
                    label,
                    vscode.TreeItemCollapsibleState.None,
                    description,
                    `${label}\n${description || 'No description'}\nLine: ${endpoint.lineNumber + 1}`,
                    filePath,
                    endpoint.lineNumber,
                    'endpoint'
                );
            });
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            return [];
        }
    }
} 