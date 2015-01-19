/* global Ext, ol */

/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.tree.plugin.TreeViewDragDrop'   
]);

var mappanel, tree;



					
Ext.application({

    name: 'OL3EXT4',

    launch: function () {

        mappanel = Ext.create('Ext.panel.Panel', {

            title: "Test Map",

            layout: 'fit',
			
			region: "center",
			
			renderTo: 'test-map',

            

            listeners: {

                afterrender: function () {

                    var osm_source = new ol.source.OSM({

                        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'

                    });

                    var osmLayer = new ol.layer.Tile({

                        source: osm_source

                    });
              
		            var layer0 = new ol.layer.Tile({
						  source: new ol.source.BingMaps({
							// Get your own key at http://bingmapsportal.com/
							// Replace the key below with your own.
							key: 'AhaJDO_bWhekq58C0nGLRkwJSMphRFDTYeccozENkqZTAAa1W0OgoaWmcgbPxatZ',
							imagerySet: 'AerialWithLabels'
							})
					});	
                 

                    this.map = new ol.Map({

                        target: 'test-map',

                      

                        layers: [layer0],

                        view: new ol.View({

                            center: ol.proj.transform([102.5883991, 26.2960083], 'EPSG:4326', 'EPSG:3857'),

                            zoom: 5

                        })

                    });
					
					var ol3d = new olcs.OLCesium(this.map ); // map is the ol.Map instance
					var scene = ol3d.getCesiumScene();
					var terrainProvider = new Cesium.CesiumTerrainProvider({
					  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
					});
					scene.terrainProvider = terrainProvider;
					ol3d.setEnabled(true);


                },

                // The resize handle is necessary to set the map!

                resize: function () {

                    var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];

                    console.log(size);

                    this.map.setSize(size);

                }

            }

        });

        
		
		tree = Ext.create('Ext.tree.Panel', {
			
			border: true,
            region: "west",
            title: "Layers",
            width: 300,
			height: 250,
            split: true,
            collapsible: true,
            collapseMode: "mini",
            autoScroll: true,
            rootVisible: false,
            lines: false,
	
			
			tbar: [{
                text: "remove",
                handler: function() {
                    layer = mapPanel.map.layers[2];
                    mapPanel.map.removeLayer(layer);
                }
            }, {
                text: "add",
                handler: function() {
                    mapPanel.map.addLayer(layer);
                }
            },{
                text: "3D",
                handler: function() {
                    mapPanel.map.addLayer(layer);
                }
            }],
			root: {
				text: 'Root',
				expanded: true,
				children: [
					{
						text: 'Child 1',
						leaf: true
					},
					{
						text: 'Child 2',
						leaf: true
					},
					{
						text: 'Child 3',
						expanded: true,
						children: [
							{
								text: 'Grandchild',
								leaf: true
							}
						]
					}
				]
			}
		});
		


		Ext.create('Ext.container.Viewport', {

            layout: 'border',
            hideBorders: true,
            items: [
                
                mappanel,tree

            ]

        });

    }

});


