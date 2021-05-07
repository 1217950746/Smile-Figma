class PageExport {
    private page: PageNode

    constructor(page: PageNode) {
        this.page = page
    }

    async ExportAsync(rootPath: string): Promise<void> {
        this.LetLayerAsync(this.page.children, async (node) => {
            if (node.exportSettings.length <= 0) return
            for (const setting of node.exportSettings) {
                var path = node.name + this.GetPathSuffix(setting)
                var fullPath = rootPath + path
                console.warn(fullPath)
                console.log(setting)
                var data = await node.exportAsync(setting)
                console.log(data)
            }
        })
    }

    private GetPathSuffix(setting: ExportSettings): string {
        return setting.suffix + '.' + setting.format.toLowerCase()
    }

    private LetLayerAsync(children: ReadonlyArray<SceneNode>, callbackfn: (node: SceneNode) => void): void {
        children.forEach(async (node) => {
            callbackfn(node)
            if (node.type === 'FRAME' || node.type === 'GROUP') {
                const nodeChildren = (node as ChildrenMixin).children
                if (nodeChildren.length > 0) this.LetLayerAsync(nodeChildren, callbackfn)
            }
        })
    }
}

async function main() {
    const rootPath = '~/Desktop/test/'
    const pages = figma.root.children
    for (const page of pages) {
        const pageExport = new PageExport(page)
        await pageExport.ExportAsync(rootPath)
    }

    figma.closePlugin()
}

main()
