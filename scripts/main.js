const PLCR = this.PLCR || {};

class PlaylistControllerInitializer {
    constructor() { }

    static initialize() {
        PlaylistControllerInitializer.hookReady();
        PlaylistControllerInitializer.hookRenderPlaylistSearch();
        PlaylistControllerInitializer.hookInit();
    }

    static hookRenderPlaylistSearch() {
        /**
         * Appends a search bar onto the playlist screen for finding songs
         */

        Hooks.on("renderPlaylistDirectory", (app, html, data) => {
            //const importPlaylistString = game.i18n.localize("PLI.ImportButton");
            const searchString = "Search";
            const searchField = $(`<input type="text" placeholder="${searchString}" style="color: white; max-width: 96%; margin: 10px 0px;" />`);
            const searchResults = $(`<li id="plcr-search-results" data-entity-id="9m16PqGayex5CSIY" class="directory-item entity playlist plcr-sr flexrow"></li>`);
            html.find(".directory-header").append(searchField)
            html.find(".directory-list").prepend(searchResults);
            searchField.keyup(debounce(function(ev) {
                PLCR.playlistController.search(ev.target.value).then(function(result) {
                    html.find("#plcr-search-results").html(result);
                }, function(err) {
                    console.log(err);
                });
            }));
        });
    }

    static hookReady() {
        Hooks.on("ready", () => {
            PLCR.playlistController = new PlaylistController();
            // TO-DO: Register all settings
        });
    }

    static hookInit() {
        Hooks.once( "init", function() {
            PlaylistControllerInitializer.loadHandleBarTemplates();
        });
    }

    async loadHandleBarTemplates()
    {
        // register templates parts
        const templatePaths = [
            "./modules/playlist-ui/templates/search-results.html"
        ];
        return loadTemplates(templatePaths);
    }
}

class PlaylistController {
    constructor() {
        /*  --------------------------------------  */
        /*            Global settings               */
        /*  --------------------------------------  */
        this.DEBUG = false; // Enable to see logs
    }
    /*  --------------------------------------  */
    /*           Helper functions               */
    /*  --------------------------------------  */

    async search(searchString) {
        if (searchString.length > 3) {
            let collection = $(`#playlists .directory-item:not(.plcr-sr) .sound-name:contains(${searchString}):not(selector)`);
            if(collection.length > 0) {
                let rows = "";
                collection.each(function() {
                    rows += $(this).parent()[0].outerHTML;
                });

                const data = {
                    resultRows: rows
                }
                return await renderTemplate("./modules/playlist-ui/templates/search-results.html", data);
            }
        }
    }

}

PlaylistControllerInitializer.initialize();