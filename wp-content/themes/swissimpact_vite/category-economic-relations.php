<?php get_header(); ?>

<?php
$category = get_category(get_query_var('cat'))
?>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    .iframe-wrapper {
        width: 100%;
        height: 84vh;
    }

    iframe {
        width: 100%;
        border: 0;
        height: 100%;
        border-bottom: 2px solid red;
    }
</style>

<?php if (types_render_termmeta('introduction')) : ?>
    <div class="w-11/12 post-content md:w-10/12 mx-auto py-10">
        <?php
        echo types_render_termmeta('introduction');
        ?>
    </div>
<?php endif; ?>

<div class="iframe-wrapper">
    <Object data="<?php echo get_template_directory_uri(); ?>/swiss-impact-map/dist/index.html" height="100%" width="100%"></object>
</div>

<main class="flex-grow py-20 bg-cover bg-pos-strips" style="background-image: url(<?php echo get_template_directory_uri(); ?>/assets/img/backpages/stripes.png);">
    <?php echo get_template_part('template-parts/featured-posts/featured', 'posts'); ?>

    <div class="w-11/12 lg:w-10/12 mx-auto my-16" id="upcoming-events">

        <div class="title flex mb-6 flex-col lg:flex-row">
            <h1 class="inline-block">Upcoming events</h1>

            <div class="category-filter w-56 lg:w-60 xl:w-52 flex items-center lg:ml-5 mb-5 lg:mb-0 relative filter-tags" data-container=".upcoming-post-wrapper" data-event="upcoming" data-category="<?php echo $category->cat_ID ?>">
                <div class="font-medium relative">
                    <div class="filter-header cursor-pointer flex flex-row border-swissred border py-1 px-2 h-8">
                        <div class="flex self-center flex-col">
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/backpages/icon-location-2x.png" class="w-5 mr-2" />
                        </div>
                        <div class="text-base">FILTER BY LOCATION</div>
                    </div>

                    <div class="filter-dropdown hidden absolute w-full top-8 left-0 border-black border bg-white">
                        <?php
                        $tags = get_tags(array('hide_empty' => false));
                        foreach ($tags as $tag) {
                            if ($tag) :
                                $custom_query_res = $wpdb->get_results("SELECT meta_value from $wpdb->termmeta INNER JOIN $wpdb->terms on " . $wpdb->terms . ".term_id = " . $wpdb->termmeta . ".term_id WHERE " . $wpdb->termmeta . ".term_id = '$tag->term_id' AND " . $wpdb->termmeta . ".meta_key = 'wpcf-taxonomy-icon' ");

                        ?>
                                <div class="left-0 p-1 w-full border-b">
                                    <div class="flex items-center">
                                        <input type="checkbox" class="mr-1" id="filter-<?php echo $tag->slug; ?>" name="<?php echo $tag->term_id; ?>">
                                        <label for="filter-<?php echo $tag->slug; ?>">
                                            <figure>
                                                <img src="<?php echo $tag->meta_value; ?>" class="w-5 mr-2" />
                                            </figure>
                                        </label>
                                        <div class="text-xs"><label for="filter-<?php echo $tag->slug; ?>"><?php echo strtoupper($tag->name); ?></label></div>
                                    </div>
                                </div>
                        <?php
                            endif;
                        }
                        ?>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php
        $args = array(
            'post_type' => 'post',
            'posts_per_page' => get_option('posts_per_page'),
            'cat' => $category->cat_ID,
            'meta_key' => 'wpcf-event-from-date',
            'orderby' => 'meta_value_num',
            'order' => 'ASC',
            'meta_query' => array(
                array(
                    'key' => 'wpcf-event-to-date',
                    'value' => todayUnixDate(),
                    'compare' => '>=',
                    'type' => 'UNSIGNED'
                )
            ),
        );

        $upcoming_posts = new WP_Query($args);

        ?>

        <?php
        if ($upcoming_posts->have_posts()) :
        ?>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-16 gap-y-10 upcoming-post-wrapper">
                <?php
                while ($upcoming_posts->have_posts()) : $upcoming_posts->the_post();
                    echo get_template_part('template-parts/get', 'post');
                endwhile;
                ?>
            </div>
            <?php
            if ($upcoming_posts->found_posts > get_option('posts_per_page')) : ?>
                <p class="text-center red my-5">
                    <a href="javascript:void(0);" data-event="upcoming" class="btn see-more-events">SEE MORE UPCOMING EVENTS</a>
                </p>
            <?php endif; ?>
        <?php else : ?>
            <div class="grid grid-cols-1 gap-x-16 gap-y-10 upcoming-post-wrapper">
                <h3>Check back soon for upcoming events.</h3>
            </div>
        <?php endif; ?>
    </div>

    <div class="w-11/12 lg:w-10/12 mx-auto my-16" id="past-events">
        <div class="title flex mb-6 flex-col lg:flex-row">
            <h1 class="inline-block">Past events</h1>

            <div class="category-filter w-56 lg:w-60 xl:w-52 flex items-center lg:ml-5 mb-5 lg:mb-0 relative filter-tags" data-container=".past-post-wrapper" data-event="past" data-category="<?php echo $category->cat_ID ?>">
                <div class="font-medium relative">
                    <div class="filter-header cursor-pointer flex flex-row border-swissred border py-1 px-2 h-8">
                        <div class="flex self-center flex-col">
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/backpages/icon-location-2x.png" class="w-5 mr-2" />
                        </div>
                        <div class="text-base">FILTER BY LOCATION</div>
                    </div>

                    <div class="filter-dropdown hidden absolute w-full top-8 left-0 border-black border bg-white">
                        <?php
                        $tags = get_tags(array('hide_empty' => false));
                        foreach ($tags as $tag) {
                            if ($tag) :
                                $custom_query_res = $wpdb->get_results("SELECT meta_value from $wpdb->termmeta INNER JOIN $wpdb->terms on " . $wpdb->terms . ".term_id = " . $wpdb->termmeta . ".term_id WHERE " . $wpdb->termmeta . ".term_id = '$tag->term_id' AND " . $wpdb->termmeta . ".meta_key = 'wpcf-taxonomy-icon' ");

                        ?>
                                <div class="left-0 p-1 w-full border-b">
                                    <div class="flex items-center">
                                        <input type="checkbox" class="mr-1" id="filter-<?php echo $tag->slug; ?>" name="<?php echo $tag->term_id; ?>">
                                        <label for="filter-<?php echo $tag->slug; ?>">
                                            <figure>
                                                <img src="<?php echo $tag->meta_value; ?>" class="w-5 mr-2" />
                                            </figure>
                                        </label>
                                        <div class="text-xs"><label for="filter-<?php echo $tag->slug; ?>"><?php echo strtoupper($tag->name); ?></label></div>
                                    </div>
                                </div>
                        <?php
                            endif;
                        }
                        ?>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php
        $args = array(
            'post_type' => 'post',
            'posts_per_page' => get_option('posts_per_page'),
            'cat' => $category->cat_ID,
            'meta_key' => 'wpcf-event-from-date',
            'orderby' => 'meta_value_num',
            'order' => 'DESC',
            'meta_query' => array(
                array(
                    'key' => 'wpcf-event-to-date',
                    'value' => todayUnixDate(),
                    'compare' => '<',
                    'type' => 'UNSIGNED'
                )
            ),
        );

        $past_posts = new WP_Query($args);

        ?>

        <?php
        if ($past_posts->have_posts()) :
        ?>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-16 gap-y-10 past-post-wrapper">
                <?php
                while ($past_posts->have_posts()) : $past_posts->the_post();
                    get_template_part('template-parts/get', 'post');
                endwhile;
                ?>
            </div>
            <?php
            if ($past_posts->found_posts > get_option('posts_per_page')) : ?>
                <p class="text-center red my-5">
                    <a href="javascript:void(0);" data-event="past" class="btn see-more-events">SEE MORE PAST EVENTS</a>
                </p>
            <?php endif; ?>
        <?php else : ?>
            <div class="grid grid-cols-1 gap-x-16 gap-y-10 past-post-wrapper">
                <h3>Check back soon for past events.</h3>
            </div>
        <?php endif; ?>
    </div>
</main>
<?php get_footer(); ?>