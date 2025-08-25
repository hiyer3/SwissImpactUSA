<?php

namespace Saltus\WP\Plugin\Saltus\InteractiveMaps\Plugin\Pro\Extras;

use Saltus\WP\Plugin\Saltus\InteractiveMaps\Core;
use Saltus\WP\Plugin\Saltus\InteractiveMaps\Plugin\Pro\ProActions;

/**
 * Adds shortcode that displays list of entries in a specific map
 */
class ProListMapEntries {
    /** Core instance */
    public $core;

    /** action assets instance */
    public $pro_actions;

    /**
     * Define Actions
     *
     * @param Core $core This plugin's instance.
     */
    public function __construct( Core $core, ProActions $pro_actions ) {
        $this->core        = $core;
        $this->pro_actions = $pro_actions;
        $this->init();
    }

    public function init() {
        add_shortcode( 'display-map-list', [ $this, 'render_map_entries_list' ] );
    }

    public function render_map_entries_list( $atts ) {
        if ( ! isset( $atts['id'] ) ) {
            return __( 'Please set a map ID for this list.', 'interactive-geo-maps' );
        }

        $atts = shortcode_atts(
            [
                'trigger'         => 'click',
                'url'             => '',
                'id'              => false,
                'label'           => 'name',
                'include-overlay' => false,
            ],
            $atts
        );

        if ( ! empty( $atts['id'] ) ) {
            $single_meta = get_post_meta( $atts['id'], 'map_info', true );

            if ( ! is_array( $single_meta ) ) {
                $single_meta = [];
            }

            $single_meta['id'] = $atts['id'];
            $single_meta       = apply_filters( 'igm_add_meta', $single_meta );
            $single_meta       = apply_filters( 'igm_prepare_meta', $single_meta );

            $url = isset( $atts['url'] ) && $atts['url'] !== '' ? "data-url='" . $atts['url'] . "'" : '';

            $all_maps = [ $single_meta ];

            // add all the other map series in overlay if they exist
            if ( $atts['include-overlay'] && ! empty( $single_meta['overlay'] ) && is_array( $single_meta['overlay'] ) ) {
                foreach ( $single_meta['overlay'] as $key => $overlay ) {
                    array_push( $all_maps, $overlay );
                }
            }

            $this->pro_actions->enqueue_action_files();

            $html = sprintf( '<div class="igm_entries_list_wrapper"><ul id="igm_entries_list_%1$s" class="igm_entries_list" data-map-id="%1$s">', $atts['id'] );

            foreach ( $all_maps as $key => $meta ) {
                if ( isset( $meta['regions'] ) && is_array( $meta['regions'] ) && ! empty( $meta['regions'] ) ) {
                    foreach ( $meta['regions'] as $key => $region ) {
                        $code = isset( $region['id'] ) ? $region['id'] : '';
                        //$name = isset( $region[ $atts['label'] ] ) ? $region[ $atts['label'] ] : $code;
                        $name  = $this->getArrayValueByDotNotation( $region, $atts['label'], $code );
                        $title = isset( $region['tooltipContent'] ) ? esc_attr( wp_strip_all_tags( $region['tooltipContent'] ) ) : '';
                        $html .= sprintf( '<li data-type="region" title="%3$s" %4$s data-code="%1$s">%2$s</li>', $code, $name, $title, $url );
                    }
                }

                if ( isset( $meta['roundMarkers'] ) && is_array( $meta['roundMarkers'] ) && ! empty( $meta['roundMarkers'] ) ) {
                    foreach ( $meta['roundMarkers'] as $key => $marker ) {
                        $code = isset( $marker['id'] ) ? $marker['id'] : '';
                        //$name = isset( $marker[ $atts['label'] ] ) ? $marker[ $atts['label'] ] : $code;
                        $name  = $this->getArrayValueByDotNotation( $marker, $atts['label'], $code );
                        $title = isset( $marker['tooltipContent'] ) ? esc_attr( wp_strip_all_tags( $marker['tooltipContent'] ) ) : '';
                        $html .= sprintf( '<li data-type="roundMarker" title="%3$s" %4$s data-code="%1$s">%2$s</li>', $code, $name, $title, $url );
                    }
                }

                if ( isset( $meta['imageMarkers'] ) && is_array( $meta['imageMarkers'] ) && ! empty( $meta['imageMarkers'] ) ) {
                    foreach ( $meta['imageMarkers'] as $key => $marker ) {
                        $code  = isset( $marker['id'] ) ? $marker['id'] : '';
                        $name  = $this->getArrayValueByDotNotation( $marker, $atts['label'], $code );
                        $title = isset( $marker['tooltipContent'] ) ? esc_attr( wp_strip_all_tags( $marker['tooltipContent'] ) ) : '';
                        $html .= sprintf( '<li data-type="imageMarker" title="%3$s" %4$s data-code="%1$s">%2$s</li>', $code, $name, $title, $url );
                    }
                }

                if ( isset( $meta['iconMarkers'] ) && is_array( $meta['iconMarkers'] ) && ! empty( $meta['iconMarkers'] ) ) {
                    foreach ( $meta['iconMarkers'] as $key => $marker ) {
                        $code  = isset( $marker['id'] ) ? $marker['id'] : '';
                        $name  = $this->getArrayValueByDotNotation( $marker, $atts['label'], $code );
                        $title = isset( $marker['tooltipContent'] ) ? esc_attr( wp_strip_all_tags( $marker['tooltipContent'] ) ) : '';
                        $html .= sprintf( '<li data-type="iconMarker" title="%3$s" %4$s data-code="%1$s">%2$s</li>', $code, $name, $title, $url );
                    }
                }
            }

            $html .= '</ul></div>';

            return $html;
        }

        return '';
    }

    /**
     * Get array value with dot notation path
     *
     * @param [type] $arr
     * @param [type] $path
     * @param string $separator
     * @return void
     */
    public function getArrayValueByDotNotation( $arr, $path, $code ) {
        $keys = explode( '.', $path );

        foreach ( $keys as $key ) {
            if ( isset( $arr[ $key ] ) ) {
                $arr = $arr[ $key ];
            }
        }

        if ( ! is_array( $arr ) ) {
            return $arr;
        }

        return $code;
    }
}
