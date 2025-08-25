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
        $featured_posts = get_field('homepage_highlightes', 'option');
        ?>

        <?php
        if ($featured_posts) :
        ?>
            <div class="swiper-wrapper">
                <?php
                foreach ($featured_posts as $post) : setup_postdata($post);
                    echo get_template_part('template-parts/get', 'slider-post');
                endforeach; ?>
            </div>
        <?php else : ?>
            <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                <h3>Check back soon for upcoming events.</h3>
            </div>
        <?php endif; ?>
        <?php wp_reset_postdata(); ?>

    </div>
</div>