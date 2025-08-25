<div class="slider-wrapper w-11/12 mx-auto lg:mr-0" id="highlights">
    <div class="title flex">
        <h1 class="inline-block">SWISS IMPACT highlights</h1>
        <div class="swiper-nav inline-flex gap-7 ml-5">
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
    </div>
    <div class="slider w-swiper">
        <?php
        $args = array(
            'post_type' => 'post',
            'meta_key' => 'wpcf-event-to-date',
            'orderby' => 'meta_value_num',
            'order' => 'DESC',
            'meta_query' => array(
                array(
                    'key' => 'wpcf-is-featured-event',
                    'value' => '1',
                    'compare' => '='
                )
            ),
        );

        $featured_posts = new WP_Query($args);

        if (!$featured_posts->have_posts()) {
            $args = array(
                'post_type' => 'post',
                'meta_key' => 'wpcf-event-to-date',
                'orderby' => 'meta_value_num',
                'order' => 'DESC',
            );
            $featured_posts = new WP_Query($args);
        }
        ?>

        <?php
        if ($featured_posts->have_posts()) :
        ?>
            <div class="swiper-wrapper">
                <?php
                while ($featured_posts->have_posts()) : $featured_posts->the_post();
                    echo get_template_part('template-parts/get', 'slider-post');
                endwhile ?>
            </div>
        <?php else : ?>
            <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                <h3>Watch out this space for upcoming events.</h3>
            </div>
        <?php endif; ?>
        <?php wp_reset_postdata(); ?>

    </div>
</div>