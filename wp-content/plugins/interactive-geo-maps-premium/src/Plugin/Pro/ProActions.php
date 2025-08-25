<?php

namespace Saltus\WP\Plugin\Saltus\InteractiveMaps\Plugin\Pro;

use Saltus\WP\Plugin\Saltus\InteractiveMaps\Core;

/**
 * Manage available click actions
 */
class ProActions {
    /** Available click actions */
    public $actions;

    /** Core instance */
    public $core;

    /** Dependencies for main actions js file */
    public $deps;

    /** URLs to load with actions */
    private $urls;

    /** Options */
    private $options;

    /**
     * Define Actions
     *
     * @param Core $core This plugin's instance.
     */
    public function __construct( Core $core ) {
        $this->core    = $core;
        $this->deps    = [];
        $this->urls    = [];
        $this->options = get_option( 'interactive-maps' );

        // add pro actions to options
        add_filter( 'igm_click_actions', [ $this, 'pro_actions' ] );

        // in the administration, we don't need to run the rest of the code
        if ( is_admin() ) {
            return;
        }

        // check if we need to add external elements like live filter
        add_action( 'igm_prepare_meta_actions', [ $this, 'pro_external_elements' ], 19 );

        // check if we need to enqueue other action files
        add_action( 'igm_prepare_meta_actions', [ $this, 'pro_actions_assets' ], 20 );

        /**
         * Duplicate 'the_content' filters
         *
         * @author Bill Erickson
         * @link http://www.billerickson.net/code/duplicate-the_content-filters/
         */
        global $wp_embed;
        add_filter( 'igm_the_content', [ $wp_embed, 'run_shortcode' ], 8 );
        add_filter( 'igm_the_content', [ $wp_embed, 'autoembed' ], 8 );
        add_filter( 'igm_the_content', 'wptexturize' );
        add_filter( 'igm_the_content', 'convert_chars' );

        // only add wpautop if the option doesn't exist or is enabled in the settings
        $add_igm_content_filter = false;
        if ( ! isset( $this->options['contentFilters'] ) ) {
            $add_igm_content_filter = true;
        }
        if ( isset( $this->options['contentFilters'] ) && is_array( $this->options['contentFilters'] ) ) {
            if ( ! empty( $this->options['contentFilters']['wpautop'] ) && $this->options['contentFilters']['wpautop'] ) {
                $add_igm_content_filter = true;
            }
        }
        if ( $add_igm_content_filter ) {
            add_filter( 'igm_the_content', 'wpautop' );
        }

        add_filter( 'igm_the_content', 'shortcode_unautop' );
        add_filter( 'igm_the_content', 'do_shortcode' );
    }

    /**
     * Prepare content to include on the map html and enqueue files if needed
     *
     * @param array $meta
     * @return array $meta
     */
    public function pro_external_elements( $meta ) {
        $handle = $this->core->name . '_map_service';
        $list   = 'enqueued';
        if ( wp_script_is( $handle, $list ) ) {
            $this->deps[] = $this->core->name . '_map_service';
        }

        // external custom legend
        if ( ! empty( $meta['customLegend'] ) && $meta['customLegend']['enabled'] === '1' && isset( $meta['customLegend']['type'] ) && $meta['customLegend']['type'] === 'external' ) {
            $this->enqueue_action_files();

            $filter = 'igm_mapbox_after';

            add_filter(
                $filter,
                function ( $content, $id ) {
                    $list = '';
                    $meta = get_post_meta( $id, 'map_info', true );

                    $entries = isset( $meta['customLegend']['data'] ) ? $meta['customLegend']['data'] : [];

                    foreach ( $entries as $entry ) {
                        $list .= '<li class="igm-external-legend-entry"><span class="igm-external-legend-graphic" style="background:' . $entry['fill'] . '"></span>' . $entry['name'] . '</li>';
                    }

                    $html = sprintf(
                        '<div class="igm-external-legend-container"><ul data-base-map-id="%1$s" id="igm-external-legend-%1$s" class="igm-external-legend">%2$s</ul></div>',
                        $id,
                        $list
                    );
                    if ( $content !== $html ) {
                        $content = $html . $content;
                    }
                    return $content;
                },
                2,
                2
            );
        }

        // prepare for dropdown interface
        if ( ! empty( $meta['externalDropdown'] ) && $meta['externalDropdown']['enabled'] === '1' ) {
            $this->enqueue_dropdown_files();
            $this->enqueue_action_files();

            $options = $this->options;

            add_filter(
                'igm_mapbox_before',
                function ( $content, $id ) use ( $meta, $options ) {
                    $series = [
                        'regions',
                        'roundMarkers',
                        'imageMarkers',
                        'iconMarkers',
                        'labels',
                    ];

                    $placeholder     = isset( $meta['externalDropdown']['placeholder'] ) ? $meta['externalDropdown']['placeholder'] : '';
                    $select          = isset( $meta['externalDropdown']['select'] ) ? $meta['externalDropdown']['select'] : '';
                    $no_matches      = isset( $meta['externalDropdown']['noResults'] ) ? $meta['externalDropdown']['noResults'] : '';
                    $use_choices     = isset( $options['use_choices'] ) ? $options['use_choices'] : true;
                    $optgroup        = isset( $meta['externalDropdown']['groupOverlay'] ) ? $meta['externalDropdown']['groupOverlay'] : false;
                    $only_parent     = isset( $meta['externalDropdown']['onlyParent'] ) ? $meta['externalDropdown']['onlyParent'] : false;
                    $exclude_regions = isset( $meta['externalDropdown']['excludeRegions'] ) ? $meta['externalDropdown']['excludeRegions'] : false;

                    $all_maps = [ $meta ];

                    $label_property = 'name';
                    $name_property  = $meta['externalDropdown']['nameProperty'];
                    if ( ! empty( $name_property ) ) {
                        $label_property = $name_property;
                    }
                    // user can set comma separated list of properties
                    $labels = explode( ',', $label_property );
                    // add all the other map series in overlay if they exist
                    if ( ! $only_parent && ! empty( $meta['overlay'] ) && is_array( $meta['overlay'] ) ) {
                        foreach ( $meta['overlay'] as $key => $overlay ) {
                            array_push( $all_maps, $overlay );
                        }
                    }

                    $classes = '';
                    if ( $meta['externalDropdown']['mobileOnly'] === '1' ) {
                        $classes = 'igm_select_mobile_only';
                    }

                    $all_entries = [];
                    $optgroup    = $optgroup && $optgroup === '1' ? [] : false;

                    foreach ( $all_maps as $key => $map ) {
                        foreach ( $series as $serie ) {
                            if ( empty( $map[ $serie ] ) || ! is_array( $map[ $serie ] ) ) {
                                continue;
                            }

                            // regions is id=name
                            if ( $serie === 'regions' ) {
                                // in case we don't want to include regions
                                if ( $exclude_regions ) {
                                    continue;
                                }

                                foreach ( $map[ $serie ] as $entry ) {
                                    // handle multiple region labels like id, name, etc
                                    foreach ( $labels as $label ) {
                                        $all_entries[ $entry['id'] ]['search'][ $label ] = $this->getArrayValueByDotNotation( $entry, $label );
                                    }
                                    $all_entries[ $entry['id'] ]['mapID'] = $map['id'];
                                }
                            } else {
                                // everything else id=id
                                foreach ( $map[ $serie ] as $entry ) {
                                    // set default id, also try to get name, just in case
                                    $entry['id'] = isset( $entry['id'] ) ? $entry['id'] : ( isset( $entry['name'] ) ? $entry['name'] : '' );

                                    if ( empty( $entry['id'] ) ) {
                                        continue;
                                    }
                                    foreach ( $labels as $label ) {
                                        $all_entries[ $entry['id'] ]['search'][ $label ] = $this->getArrayValueByDotNotation( $entry, $label );
                                    }
                                    $all_entries[ $entry['id'] ]['mapID'] = $map['id'];
                                }
                            }
                        }

                        if ( is_array( $optgroup ) ) {
                            $optgroup[ $map['title'] ] = $all_entries;
                            $all_entries               = [];
                        }
                    }

                    $main_class = 'igm_select_choices';
                    if ( ! $use_choices ) {
                        $main_class = 'igm_select';
                    }

                    $html = sprintf(
                        '<div class="igm_select_container %2$s">
					<select class="%6$s" data-noresults="%5$s" data-select="%4$s" data-map-id="%1$s" id="igm_select_%1$s">
					<option value="">%3$s</option>',
                        $id,
                        $classes,
                        $placeholder, // 3
                        $select, // 4
                        $no_matches, // 5
                        $main_class // 6
                    );

                    if ( is_array( $optgroup ) ) {
                        foreach ( $optgroup as $okey => $ovalue ) {
                            asort( $ovalue );
                            $mid       = '';
                            $temp_opts = '';
                            foreach ( $ovalue as $key => $value ) {
                                if ( ! is_array( $value ) ) {
                                    continue;
                                }

                                // populate region labels for dropdown element
                                $region_labels = [];
                                foreach ( $labels as $label ) {
                                    if ( isset( $value['search'][$label] ) ) {
                                        $region_label = $value['search'][$label];
                                        // only use properties that have values
                                        if ( !empty( $region_label ) ) {
                                            $region_labels[] = $region_label;
                                        } else {
                                            // default region labels is `name` and some elements like custom
                                            // markers don't seem to have a name property, use id in that case
                                            $region_labels[] = $key;
                                        }
                                    }
                                }

                                // join the region labels with a comma
                                $region_label = implode( ', ', $region_labels );

                                $value['value'] = isset( $value['value'] ) ? $value['value'] : '';

                                $temp_opts .= sprintf(
                                    '<option value="%1$s" data-map-id="%3$s">%2$s</option>',
                                    $region_label,
                                    $value['value'],
                                    $value['mapID']
                                );

                                $mid = $value['mapID'];
                            }

                            $html .= sprintf(
                                '<optgroup data-map-id="%3$s" label="%1$s">%2$s</optgroup>',
                                $okey,
                                $temp_opts,
                                $mid
                            );
                        }
                    } else {
                        asort( $all_entries );

                        foreach ( $all_entries as $key => $entry ) {
                            if ( empty( $entry['search'] ) ) {
                                continue;
                            }
                            if ( empty( $entry['mapID'] ) ) {
                                continue;
                            }

                            $custom_props  = '';
                            $custom_titles = [];
                            foreach ( $entry['search'] as $custom_prop_key => $custom_prop_value ) {
                                $custom_props .= esc_attr( sprintf( '"%1$s": "%2$s";', $custom_prop_key, $custom_prop_value ) );
                                $custom_titles[] = $custom_prop_value;
                            }

                            $custom_titles = esc_attr( implode( ', ', $custom_titles ) );
                            $option_id     = esc_attr( 'option-geo-' . $key );

                            $html .= sprintf(
                                '<option id="%5$s" data-map-id="%3$s" value="%1$s" data-custom-properties="{%4$s}">%2$s</option>',
                                $key,
                                $custom_titles,
                                $entry['mapID'],
                                $custom_props,
                                $option_id
                            );
                        }
                    }

                    $html .= '</select></div>';

                    $content = $html . $content;

                    return $content;
                },
                2,
                2
            );
        }

        // live filter
        if ( ! empty( $meta['liveFilter'] ) && $meta['liveFilter']['enabled'] === '1' ) {
            $this->enqueue_action_files();

            if ( $meta['liveFilter']['position'] === 'above' ) {
                $filter = 'igm_mapbox_before';
            } else {
                $filter = 'igm_mapbox_after';
            }

            add_filter(
                $filter,
                function ( $content, $id ) {
                    $list = '';
                    $meta = get_post_meta( $id, 'map_info', true );
                    $html = '';

                    $id = intval( $id );

                    $default   = isset( $meta['liveFilter']['default'] ) ? intval( $meta['liveFilter']['default'] ) : 0;
                    $type      = isset( $meta['liveFilter']['type'] ) ? $meta['liveFilter']['type'] : 'menu';
                    $icount    = isset( $meta['liveFilter']['includeCount'] ) && $meta['liveFilter']['includeCount'] === '1' ? true : false;
                    $keep_base = isset( $meta['liveFilter']['keepBase'] ) && $meta['liveFilter']['keepBase'] === '1' ? true : false;

                    // data containers
                    $containers = [
                        'regions',
                        'roundMarkers',
                        'iconMarkers',
                        'imageMarkers',
                        'labels',
                    ];

                    if ( ! is_array( $meta['overlay'] ) ) {
                        return '';
                    }

                    $html = '';

                    if ( 'menu' === $type || 'menu_dropdown' === $type ) {
                        foreach ( $meta['overlay'] as $map_id ) {
                            $title = get_the_title( $map_id );

                            $map_id = intval( $map_id );
                            $count  = '';

                            if ( $icount ) {
                                // get meta to count
                                $ometa       = get_post_meta( $map_id, 'map_info', true );
                                $ometa['id'] = $map_id;
                                $ometa       = apply_filters( 'igm_prepare_meta', $ometa );

                                $count = 0;
                                foreach ( $containers as $data_container ) {
                                    $scount = isset( $ometa[ $data_container ] ) && is_array( $ometa[ $data_container ] ) ? count( $ometa[ $data_container ] ) : 0;
                                    $count  = $count + $scount;
                                }

                                $title .= ' (' . $count . ')';
                            }

                            /**
                             * Apply filters to the live map title:
                             *  - $title: the map title
                             *  - $map_id: the map id
                             *  - $count: if enabled, the number of regions and markers
                             */
                            $title = apply_filters( 'igm_live_map_title', $title, $map_id, $count );

                            $class = $default === $map_id ? 'igm-live-filter-active' : '';
                            $list .= '<li class="' . $class . '" data-map-id="' . $map_id . '">' . $title . '</li>';
                        }

                        $all_class       = $default === $id ? 'igm-live-filter-active' : '';
                        $container_class = 'menu_dropdown' === $type ? 'class="igm_hide_on_mobile"' : '';

                        $html .= sprintf(
                            '<div %6$s><ul data-base-map-id="%1$s" id="igm-live-filter-%1$s" class="igm-live-filter" data-keep-base-map="%5$s"><li data-map-id="%1$s" class="%4$s">%2$s</li>%3$s</ul></div>',
                            $id,
                            $meta['liveFilter']['allLabel'],
                            $list,
                            $all_class,
                            $keep_base,
                            $container_class
                        );
                    }

                    if ( 'dropdown' === $type || 'menu_dropdown' === $type ) {
                        $container_class = 'menu_dropdown' === $type ? 'class="igm_show_on_mobile"' : '';

                        foreach ( $meta['overlay'] as $map_id ) {
                            $map_id = intval( $map_id );

                            $title = get_the_title( $map_id );
                            $count = '';

                            if ( $icount ) {
                                // get meta to count
                                $ometa       = get_post_meta( $map_id, 'map_info', true );
                                $ometa['id'] = $map_id;
                                $ometa       = apply_filters( 'igm_prepare_meta', $ometa );

                                $count = 0;
                                foreach ( $containers as $data_container ) {
                                    $scount = isset( $ometa[ $data_container ] ) && is_array( $ometa[ $data_container ] ) ? count( $ometa[ $data_container ] ) : 0;
                                    $count  = $count + $scount;
                                }

                                $title .= ' (' . $count . ')';
                            }

                            /**
                             * Apply filters to the live map title:
                             *  - $title: the map title
                             *  - $map_id: the map id
                             *  - $count: if enabled, the number of regions and markers
                             */
                            $title = apply_filters( 'igm_live_map_title', $title, $map_id, $count );

                            $selected = $default === $map_id ? 'selected' : '';
                            $list .= '<option ' . $selected . ' value="' . $map_id . '" data-map-id="' . $map_id . '">' . $title . '</option>';
                        }

                        $all_selected = $default === $id ? 'selected' : '';

                        $html .= sprintf(
                            '<div %6$s>
								<select data-base-map-id="%1$s" id="igm-live-filter-%1$s" class="igm-live-filter-dropdown" data-keep-base-map="%5$s">
									<option data-map-id="%1$s" value="%1$s" %4$s>%2$s</option>
									%3$s
								</select>
							</div>',
                            $id,
                            $meta['liveFilter']['allLabel'],
                            $list,
                            $all_selected,
                            $keep_base,
                            $container_class
                        );
                    }

                    if ( $content !== $html ) {
                        $content = $html . $content;
                    }
                    return $content;
                },
                2,
                2
            );
        }

        return $meta;
    }

    /**
     * Get array value with dot notation path
     *
     * @param [type] $arr
     * @param [type] $path
     * @param string $separator
     * @return mixed
     */
    public function getArrayValueByDotNotation( $arr, $path, $separator = '.' ) {
        $keys = explode( '.', $path );

        foreach ( $keys as $key ) {
            if ( isset( $arr[ $key ] ) ) {
                $arr = $arr[ $key ];
            }
        }

        if ( ! is_array( $arr ) ) {
            return $arr;
        }

        return false;
    }

    /**
     * Set available actions
     *
     * @return array
     */
    public function get_actions( $type = 'all' ) {
        $actions = [
            'igm_lightbox'                      => __( 'Open content in Lightbox', 'interactive-geo-maps' ),
            'igm_lightbox_iframe'               => __( 'Open URL in Lightbox (iframe)', 'interactive-geo-maps' ),
            'igm_lightbox_image'                => __( 'Open Image in Lightbox', 'interactive-geo-maps' ),
            'igm_display_below'                 => __( 'Display content below', 'interactive-geo-maps' ),
            'igm_display_below_scroll'          => __( 'Display content below & scroll', 'interactive-geo-maps' ),
            'igm_display_above'                 => __( 'Display content above', 'interactive-geo-maps' ),
            'igm_display_right_1_3'             => __( 'Display content to right', 'interactive-geo-maps' ),
            'igm_display_page_below'            => __( 'Display page below (beta)', 'interactive-geo-maps' ),
            'igm_display_page_below_and_scroll' => __( 'Display page below & scroll (beta)', 'interactive-geo-maps' ),
            'igm_display_map'                   => __( 'Display specific map (beta)', 'interactive-geo-maps' ),
        ];

        return $actions;
    }

    public function pro_actions( $actions ) {
        $actions = array_merge( $actions, $this->get_actions() );

        // default and pro
        return $actions;
    }

    public function pro_actions_assets( $meta ) {
        $existing_actions = [];
        $actions          = $this->get_actions();

        // default relations. series => seriesDefaults
        $relation = [
            'regions'      => 'regionDefaults',
            'roundMarkers' => 'markerDefaults',
            'imageMarkers' => 'imageMarkerDefaults',
            'iconMarkers'  => 'iconMarkerDefaults',
            'labels'       => 'labelDefaults',
        ];

        foreach ( $relation as $series => $default ) {
            if ( ! isset( $meta[ $series ] ) ) {
                continue;
            }

            if ( ! is_array( $meta[ $series ] ) ) {
                continue;
            }
            // flag to check if custom action was already added
            $custom_action = false;

            $count_series = count( $meta[ $series ] );
            foreach ( $meta[ $series ] as $key => $value ) {
                $thisaction = '';

                if ( isset( $value['useDefaults'] ) && $value['useDefaults'] === '1' ) {
                    if ( isset( $meta[ $default ]['action'] ) && ( array_key_exists( $meta[ $default ]['action'], $actions ) || strpos( $meta[ $default ]['action'], 'custom' ) === 0 ) ) {
                        $thisaction         = $meta[ $default ]['action'];
                        $existing_actions[] = $thisaction;
                    }
                } else {
                    if ( isset( $value['action'] ) && array_key_exists( $value['action'], $actions ) ) {
                        $thisaction         = $value['action'];
                        $existing_actions[] = $thisaction;
                    } elseif ( isset( $value['action'] ) && $value['action'] === 'default' ) {
                        if ( isset( $meta[ $default ]['action'] ) && ( array_key_exists( $meta[ $default ]['action'], $actions ) || strpos( $meta[ $default ]['action'], 'custom' ) === 0 ) ) {
                            $thisaction         = $meta[ $default ]['action'];
                            $existing_actions[] = $thisaction;
                        }
                    }
                }

                // output inline content for some actions
                $inline_content_actions = [
                    'igm_lightbox',
                    'igm_display_right_1_3',
                    'igm_display_below',
                    'igm_display_above',
                    'igm_display_below_scroll',
                ];

                if ( in_array( $thisaction, $inline_content_actions, true ) ) {
                    $idattr = str_replace( ' ', '', $value['id'] );
                    $idattr = str_replace( ',', '_', $idattr );
                    $idattr = rawurlencode( $idattr );
                    $idattr = str_replace( '%', '', $idattr );

                    // todo: use array of find/replace
                    $idattr = strtolower( $idattr ) . '_' . $meta['id'];

                    $content = isset( $value['content'] ) ? $value['content'] : '';
                    $content = $this->replace_placeholders( $content, $value );

                    // before running filters, just in case, check for shortcodes that might cause infinite loop
                    if ( has_shortcode( $content, 'display-map' ) ) {
                        // we need to check if it's the same map already running, and remove it
                        $matches = [];
                        preg_match( '/\[display-map (.+?)\]/', $content, $matches );

                        $matches = array_pop( $matches );
                        $matches = explode( ' ', $matches );
                        $params  = [];
                        foreach ( $matches as $m ) {
                            list( $opt, $val ) = explode( '=', $m );
                            $params[ $opt ]    = trim( $val, '"' );
                        }
                        if ( array_key_exists( 'id', $params ) && intval( $params['id'] ) === intval( $value['id'] ) ) {
                            $content = str_replace( $matches, '', $content );
                            $content .= '<div class="igm_error">' . __( 'Error: not possible to render the same map in this action content', 'interactive-geo-maps' ) . '</div>';
                        }
                    }

                    $content = apply_filters( 'igm_the_content', $content );
                    $content = '<div data-original-id="' . esc_attr( $value['id'] ) . '" data-content-type="' . $series . '" data-content-index="' . $key . '" class="igm-map-content" id="' . $idattr . '">' . $content . '</div>';

                    $this->core->add_footer_content( $content );
                }

                if ( strpos( $thisaction, 'custom' ) === 0 && ! $custom_action ) {
                    $code = $meta[ $default ]['customAction'];

                    // code will be sanitized, but we still need operators to work in JS
                    $code = str_replace( '&gt;', '>', $code );
                    $code = str_replace( '&lt;', '<', $code );
                    $code = str_replace( '&amp;', '&', $code );

                    $content = '
					function ' . $thisaction . '_' . $meta['id'] . '( data ) {
						' . $code . '
					}';

                    $this->core->add_footer_scripts( $content );
                    $custom_action = true; // custom action was added, no need to add it again for the other entries
                }
            }
        }

        $this->prepare_action_assets( $existing_actions );

        return $meta;
    }

    /**
     * Replace placeholders by values
     *
     * @param string $body
     * @param array  $vars
     * @return string String with replaced placeholders
     */
    public function replace_placeholders( $body, $vars ) {
        $body = preg_replace_callback(
            '/{([^}]+)}/',
            function ( $m ) use ( $vars ) {
                $found = $this->getArrayValueByDotNotation( $vars, $m[1] );
                if ( isset( $found ) && strlen( $found ) ) {
                    return $found;
                } else {
                    return '';
                }
            },
            $body
        );

        return $body;
    }

    /** @deprecated 1.6.2 */
    public function check_existing_actions( $relation ) {
        $existing_actions = [];
        $actions          = $this->get_actions();

        foreach ( $relation as $series => $default ) {
            if ( ! isset( $meta[ $key ] ) ) {
                continue;
            }

            $exists           = $this->action_exists_in_series( $meta[ $source ], $actions );
            $existing_actions = array_merge( $existing_actions, $exists );

            if ( isset( $meta[ $default ]['action'] ) && array_key_exists( $meta[ $default ]['action'], $actions ) ) {
                $existing_actions = array_merge( $existing_actions, $meta[ $default ]['action'] );
            }
        }

        return $existing_actions;
    }

    /** @deprecated 1.6.2 */
    public function action_exists_in_series( $data, $actions ) {
        $existing_actions = [];

        if ( ! is_array( $data ) ) {
            return $existing_actions;
        }

        foreach ( $data as $key => $value ) {
            if ( isset( $value['action'] ) && array_key_exists( $value['action'], $actions ) ) {
                $existing_actions[] = $value['action'];
            }
        }

        return $existing_actions;
    }

    /**
     * Undocumented function
     *
     * @param [type] $actions
     * @return void
     */
    private function prepare_action_assets( $actions ) {
        if ( empty( $actions ) ) {
            return;
        }

        $actions = array_unique( $actions );

        foreach ( $actions as $action ) {
            switch ( $action ) {
                case 'igm_display_right_1_3':
                    add_filter(
                        'igm_mapbox_classes',
                        function ( $classes ) {
                            $classes .= ' igm_content_left_2_3';
                            return $classes;
                        }
                    );
                    add_filter(
                        'igm_mapbox_after',
                        function ( $content, $id ) {
                            $html = '<div class="igm_content_gutter" style="{gutterStyles}"></div><div style="{styles}" class="igm_content_right_1_3"><div id="default_' . $id . '">{description}</div></div>';
                            if ( $content !== $html ) {
                                $content = $html . $content;
                            }
                            return $content;
                        },
                        2,
                        2
                    );
                    break;

                case 'igm_display_below':
                case 'igm_display_below_scroll':
                case 'igm_display_page_below':
                case 'igm_display_page_below_and_scroll':
                    add_filter(
                        'igm_mapbox_after',
                        function ( $content, $id ) {
                            $html = '<div class="igm_content_below"><div id="default_' . $id . '">{description}</div></div>';
                            if ( $content !== $html ) {
                                $content = $html . $content;
                            }
                            return $content;
                        },
                        2,
                        2
                    );
                    break;

                case 'igm_display_above':
                case 'igm_display_above_scroll':
                    add_filter(
                        'igm_mapbox_before',
                        function ( $content, $id ) {
                            $html = '<div class="igm_content_above"><div id="default_' . $id . '">{description}</div></div>';
                            if ( $content !== $html ) {
                                $content = $html . $content;
                            }
                            return $content;
                        },
                        2,
                        2
                    );
                    break;

                case 'igm_lightbox':
                case 'igm_lightbox_iframe':
                case 'igm_lightbox_image':
                    $this->enqueue_lightbox_files();
                    break;

                default:
                    // code...
                    break;
            }
        }

        $this->enqueue_action_files();
    }

    public function enqueue_dropdown_files() {
        $hasfilter = has_filter( 'igm_public_assets_url' );
        if ( $hasfilter ) {
            $url       = apply_filters( 'igm_public_assets_url', 'vendor/choices/public/assets/scripts/choices.min.js' );
            $style_url = apply_filters( 'igm_public_assets_url', 'vendor/choices/public/assets/styles/choices.min.css' );
        } else {
            $url       = plugins_url( 'assets/public/vendor/choices/public/assets/scripts/choices.min.js', $this->core->file_path );
            $style_url = plugins_url( 'assets/public/vendor/choices/public/assets/styles/choices.min.css', $this->core->file_path );
        }

        $options = $this->options;
        if ( isset( $options['async'] ) && $options['async'] ) {
            $this->urls[] = $url;
        } else {
            $this->deps[] = $this->core->name . '_chosen';
            wp_register_script(
                $this->core->name . '_chosen',
                $url,
                [],
                true,
                true
            );
            wp_enqueue_script( $this->core->name . '_chosen' );
            $this->modify_script_tag( $this->core->name . '_chosen' );
        }

        // styles
        wp_register_style(
            $this->core->name . '_chosen',
            $style_url,
            false,
            $this->core->version
        );

        wp_enqueue_style( $this->core->name . '_chosen' );
    }

    public function enqueue_action_files() {
        // add option values
        $options = $this->options;

        $hasfilter = has_filter( 'igm_public_assets_url' );
        if ( $hasfilter ) {
            $url        = apply_filters( 'igm_public_assets_url', 'map-actions/actions.min.js' );
            $styles_url = apply_filters( 'igm_public_assets_url', 'map-actions/actions.min.css' );
        } else {
            $url        = defined( 'WP_DEBUG' ) && true === WP_DEBUG ? 'assets/public/map-actions/actions.js' : 'assets/public/map-actions/actions.min.js';
            $url        = plugins_url( $url, $this->core->file_path );
            $styles_url = plugins_url( 'assets/public/map-actions/actions.min.css', $this->core->file_path );
        }

        wp_deregister_script( $this->core->name . '_actions' );

        $dependencies = is_array( $this->deps ) && ! empty( $this->deps ) ? $this->deps : [];

        wp_register_script(
            $this->core->name . '_actions',
            $url,
            $dependencies,
            $this->core->version,
            true
        );
        wp_enqueue_script( $this->core->name . '_actions' );

        // check if we need to add scripts
        if ( $this->core->footer_scripts !== '' ) {
            wp_add_inline_script( $this->core->name . '_actions', $this->core->footer_scripts, 'before' );
        }

        $lightbox_height = isset( $options['lightbox_height_auto'] ) && $options['lightbox_height_auto'] !== 'auto' ? $options['lightbox_height'] : 'auto';

        $settings = [
            'lightboxWidth'  => isset( $options['lightbox_width'] ) ? $options['lightbox_width'] : '600',
            'lightboxHeight' => $lightbox_height,
            'restURL'        => get_rest_url( null, 'wp/v2/' ),
            'urls'           => $this->urls,
        ];

        if ( isset( $options['async'] ) && $options['async'] ) {
            $settings['async'] = true;
            $this->async_script_tag( $this->core->name . '_actions' );
        } else {
            $this->modify_script_tag( $this->core->name . '_actions' );
        }

        wp_localize_script( $this->core->name . '_actions', 'iMapsActionOptions', $settings );

        // styles
        wp_register_style(
            $this->core->name . '_actions',
            $styles_url,
            false,
            $this->core->version
        );

        wp_enqueue_style( $this->core->name . '_actions' );
    }

    private function enqueue_lightbox_files() {
        $hasfilter = has_filter( 'igm_public_assets_url' );
        if ( $hasfilter ) {
            $url        = apply_filters( 'igm_public_assets_url', 'vendor/glightbox/js/glightbox.min.js' );
            $styles_url = apply_filters( 'igm_public_assets_url', 'vendor/glightbox/css/glightbox.min.css' );
        } else {
            $url        = plugins_url( 'assets/public/vendor/glightbox/js/glightbox.min.js', $this->core->file_path );
            $styles_url = plugins_url( 'assets/public/vendor/glightbox/css/glightbox.min.css', $this->core->file_path );
        }

        $options = $this->options;
        if ( isset( $options['async'] ) && $options['async'] ) {
            $this->urls[] = $url;
        } else {
            wp_register_script(
                $this->core->name . '_lightbox',
                $url,
                [],
                true,
                true
            );
            wp_enqueue_script( $this->core->name . '_lightbox' );
        }

        // styles
        wp_register_style(
            $this->core->name . '_lightbox',
            $styles_url,
            false,
            $this->core->version
        );

        wp_enqueue_style( $this->core->name . '_lightbox' );
    }

    /**
     * Add the script id to the script tag and hopefully remove async attribute added by other plugins
     *
     * @param string $script_id
     * @return void
     */
    public function modify_script_tag( $script_id ) {
        add_filter(
            'script_loader_tag',
            function ( $tag, $handle, $src ) use ( $script_id ) {
                // check against our registered script handle
                if ( $script_id === $handle ) {
                    // add attributes of your choice
                    $tag = str_replace( 'async=\'async\'', '', $tag );
                }
                return $tag;
            },
            31, // async for WordPress plugin uses 20
            3
        );
    }

    /**
     * Add the async attribute to script tag
     *
     * @param string $script_id
     * @return void
     */
    public function async_script_tag( $script_id ) {
        add_filter(
            'script_loader_tag',
            function ( $tag, $handle, $src ) use ( $script_id ) {
                // check against our registered script handle
                if ( $script_id === $handle ) {
                    if ( strpos( $tag, 'async' ) === false ) {
                        // add attributes of your choice
                        $tag = str_replace( '<script ', '<script async=\'async\' ', $tag );
                    }
                }
                return $tag;
            },
            31, // async for WordPress plugin uses 20
            3
        );
    }
}
