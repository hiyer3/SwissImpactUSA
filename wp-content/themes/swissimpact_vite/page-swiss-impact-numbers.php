<?php

/**
 * Template Name: Swiss Impact Numbers
 */
?>

<?php get_header('minimal'); ?>

<section class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 w-11/12 mx-auto lg:mx-0 pt-10 md:pt-20 pb-10 post-content">
    <div class="lg:mx-12">
        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/hero-economic-icon-2x.png" alt="Economic Impact US Map Icon" class="w-full max-w-[165px]" />
    </div>
    <div>
        <h2><?php echo get_the_title(); ?></h2>
        <p><?php echo types_render_field("hero-description"); ?></p>
    </div>
</section>

<?php get_template_part('template-parts/si-impact-map'); ?>

<div class="slider-wrapper w-11/12 mx-auto lg:mr-0 mb-20" id="highlights">
    <div class="title flex">
        <h1 class="inline-block">Featured events</h1>
        <div class="swiper-nav inline-flex gap-7 ml-5">
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
    </div>
    <div class="slider w-swiper">
        <?php
        $featured_events = get_field('map_featured_events', 'option');

        if ($featured_events && is_array($featured_events)) {
            $post_ids = array();
            foreach ($featured_events as $event) {
                if (is_object($event) && isset($event->ID)) {
                    $post_ids[] = $event->ID;
                } elseif (is_array($event) && isset($event['ID'])) {
                    $post_ids[] = $event['ID'];
                } elseif (is_numeric($event)) {
                    $post_ids[] = $event;
                }
            }

            if (!empty($post_ids)) {
                $args = array(
                    'post_type'      => 'post',
                    'post__in'       => $post_ids,
                    'orderby'        => 'post__in',
                    'posts_per_page' => count($post_ids),
                );
                $featured_posts = new WP_Query($args);
            } else {
                $featured_posts = new WP_Query(array('post__in' => array(0)));
            }
        } else {
            $featured_posts = new WP_Query(array('post__in' => array(0)));
        }
        ?>

        <?php if ($featured_posts->have_posts()) : ?>
            <div class="swiper-wrapper">
                <?php while ($featured_posts->have_posts()) : $featured_posts->the_post();
                    echo get_template_part('template-parts/get', 'slider-post');
                endwhile; ?>
            </div>
        <?php else : ?>
            <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                <h3>Watch out this space for upcoming events.</h3>
            </div>
        <?php endif; ?>
        <?php wp_reset_postdata(); ?>
    </div>
</div>

<style>
    h2 {
        font-size: clamp(1.5rem, 1.1667rem + 1.4815vw, 2.5rem);
        line-height: 1;
    }
</style>

<?php get_footer(); ?>
