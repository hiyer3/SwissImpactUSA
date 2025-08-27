<?php

/**
 * Template Name: Swiss Impact Numbers
 */
?>

<?php get_header('minimal'); ?>

<section class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 w-11/12 mx-auto lg:mx-0 pt-20 pb-10 post-content">
    <div class="lg:mx-12">
        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/hero-economic-icon-2x.png" alt="Economic Impact US Map Icon" class="w-full max-w-[165px]" />
    </div>
    <div>
        <h2><?php echo get_the_title(); ?></h2>
        <p><?php echo types_render_field("hero-description"); ?></p>
    </div>
</section>

<div class="relative min-h-[1440px] mb-20">
    <section class="si-map-wrapper">
        <div class="relative">
            <a href="javascript: void(0);" class="bg-white state-selector">
                By State <span class="text-swissred pl-1 text-xl">+</span>
            </a>
            <div class="fixed lg:absolute z-[45] state-list-container left-0 top-[10%] lg:top-0 w-60 h-[90%] lg:h-full py-10 px-8 bg-white shadow-[inset_0_0px_6px_rgba(112,112,112,0.75)]">
                <p class="font-bold uppercase text-base text-swissred">By State</p>
                <div class="state-search-wrapper relative">
                    <input id="state-search" type="text" class="w-full border rounded-3xl border-[#707070] px-4 py-1 mb-4" />
                </div>
                <ul id="state-list" class="space-y-1 text-sm overflow-y-scroll max-h-[83%]"></ul>
            </div>
        </div>
        <div class="flex flex-col min-w-0 relative">
            <div class="mb-4 si-map-filter-wrapper min-w-0 overflow-x-auto scroll-smooth no-scrollbar overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                <div id="si-map-filter" class="flex gap-4 px-4 py-2 min-w-max">
                    <div class="single-filter-item active" id="si-filter-see-all" title="See All">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/see-all-icon.png" alt="See All Icon" class="w-full max-w-[120px]" />
                    </div>
                    <div class="single-filter-item" id="si-filter-economic-impact" title="Economic Impact">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/economic-impact-icon.png" alt="Economic Impact Icon" class="w-full max-w-[120px]" />
                    </div>
                    <div class="single-filter-item" id="si-filter-science-academia" title="Science & Academia">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/science-academia-icon.png" alt="Science & Academia Icon" class="w-full max-w-[120px]" />
                    </div>
                    <div class="single-filter-item" id="si-filter-apprenticeship-companies" title="Apprenticeship Companies">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/apprenticeship-companies-icon.png" alt="Apprenticeship Companies Icon" class="w-full max-w-[150px]" />
                    </div>
                    <div class="single-filter-item" id="si-filter-industry-clusters" title="Industry Clusters">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/industry-cluster-icon.png" alt="Industry Clusters Icon" class="w-full max-w-[80px]" />
                    </div>
                    <div class="single-filter-item" id="si-filter-swiss-representatives" title="Swiss Representatives">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/swiss-representation.png" alt="Swiss Representatives Icon" class="w-full max-w-[120px]" />
                    </div>
                </div>
            </div>
            <div id="si-map"></div>
        </div>
    </section>
    <div class="data-popup mb-8 lg:mb-0 overflow-hidden bg-swissred lg:absolute w-full h-full top-0 left-0 z-20 pb-20 max-h-[90%] hidden">
        <div class="bg-white grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
            <div></div>
            <div class="overflow-hidden">
                <div class="popup-filter-wrapper flex flex-col min-w-0 relative bg-white">
                    <div class="min-w-0 overflow-x-auto scroll-smooth no-scrollbar overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                        <div id="si-map-popup-filter" class="flex gap-4 px-4 min-w-max">
                            <div class="single-popup-filter active" id="si-popup-filter-see-all" title="See All">
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/bp-swiss-impact-ko-2x.png" alt="See All Icon" class="w-full max-w-[120px]" />
                            </div>
                            <div class="single-popup-filter" id="si-popup-filter-economic-impact" title="Economic Impact">
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/bp-economic-impact-ko-2x.png" alt="Economic Impact Icon" class="w-full max-w-[120px]" />
                            </div>
                            <div class="single-popup-filter" id="si-popup-filter-science-academia" title="Science & Academia">
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/bp-science-academia-ko-2x.png" alt="Science & Academia Icon" class="w-full max-w-[120px]" />
                            </div>
                            <div class="single-popup-filter" id="si-popup-filter-apprenticeship-companies" title="Apprenticeship Companies">
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/bp-apprenticeship-companies-ko-2x.png" alt="Apprenticeship Companies Icon" class="w-full max-w-[150px]" />
                            </div>
                            <div class="single-popup-filter" id="si-popup-filter-industry-clusters" title="Industry Clusters">
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/bp-industry-clusters-ko-2x-2.png" alt="Industry Clusters Icon" class="w-full max-w-[80px]" />
                            </div>
                            <div class="single-popup-filter" id="si-popup-filter-swiss-representatives" title="Swiss Representatives">
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/img/si-number-map/bp-swiss-representations-ko-2x.png" alt="Swiss Representatives Icon" class="w-full max-w-[120px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
            <div></div>
            <div class="popup-content-wrapper h-full px-5">
            </div>
        </div>

    </div>

    <?php echo get_template_part('template-parts/featured-posts/featured', 'posts', ['slug' => "cat_innovation"]); ?>
</div>


<style>
    h2 {
        font-size: clamp(1.5rem, 1.1667rem + 1.4815vw, 2.5rem);
        line-height: 1;
    }
</style>

<?php get_footer(); ?>