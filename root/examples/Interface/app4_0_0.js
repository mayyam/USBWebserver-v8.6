/* global Ext, ol */

/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.tree.plugin.TreeViewDragDrop'   
]);

var mapPanel, tree;

Ext.application({

    name: 'OL3EXT4',

    launch: function () {

        var mappanel = Ext.create('Ext.panel.Panel', {

            title: "Test Map",

            layout: 'fit',
			
			region: "center",

            html: "<div id='test-map'></div>", // The map will be drawn inside

            listeners: {

                afterrender: function () {

                    var osm_source = new ol.source.OSM({

                        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'

                    });

                    var osmLayer = new ol.layer.Tile({

                        source: osm_source

                    });

 

                    this.map = new ol.Map({

                        target: 'test-map',

                        renderer: 'canvas',

                        layers: [osmLayer],

                        view: new ol.View({

                            center: [-10764594.0, 4523072.0],

                            zoom: 5

                        })

                    });

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
			renderTo: Ext.getBody(),
			title: 'Simple Tree',
			width: 300,
			height: 250,
			border: true,
			region: "west",
			collapsible: true,
            collapseMode: "mini",
            autoScroll: true,
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

