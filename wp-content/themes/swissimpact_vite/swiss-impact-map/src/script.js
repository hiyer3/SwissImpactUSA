import './style.css'
import './style-touchscreen.css'
import gsap from "gsap";
import {TextPlugin} from "gsap/TextPlugin"
import { Chart, registerables} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

/*WELCOME ANIMATION */
/* */ 
/* */

const body = document.querySelector('body')
if(!window.innerHeight===body.clientHeight){
    body.clientHeight = window.innerHeight
}

const welcome_loader = document.querySelector('.welcome')
const welcome_h1 = document.querySelector('.welcome h1')
const flag = document.querySelector('.flag')
const square = document.querySelector('.square')
const hide_flag = document.querySelector('.hide_flag')

const welcome_timeline = gsap.timeline()
welcome_timeline.delay(0.5)

welcome_timeline
.to(square,{height:window.matchMedia("(max-width: 1023px)").matches?"12vw":"6.927vw"})
.to(welcome_h1,{x:"0",autoAlpha:1,duration:1.5})
.to(flag,{autoAlpha:1},"-=0.5")
.to(hide_flag,{x:"-30%",duration:1.5},"-=0.3")
.to(welcome_loader,{autoAlpha:0,duration:1})

window.addEventListener('load',()=>{
    Chart.register(...registerables,ChartDataLabels);
    gsap.registerPlugin(TextPlugin);

    //General
    const error_window = document.querySelector('.error_window')
    const error_text = document.querySelector('.error_window p')
    const loader = document.querySelector('.loader')
    const circles = document.querySelectorAll('.circle')
    const washington = document.querySelector('.washington')
    const map = document.querySelector('.map')
    const logo = document.querySelector('.logo')
    const aside = document.querySelector('aside')
    const back_to_map = document.querySelector('.back_to_map')
    const arrow_svg = document.querySelector('.back_to_map svg')
    const state = document.querySelectorAll('.state')
    const state_label = document.querySelector('.state_label')
    const datas_window = document.querySelector('.datas_window')
    const state_list = document.querySelector('.state_list')
    const search_state = document.getElementById('search_state')
    let all_state_list = null
    let datas_window_statu = false
    const state_array = [
        "United-States",
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District-of-Columbia",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New-Hampshire",
        "New-Jersey",
        "New-Mexico",
        "New-York",
        "North-Carolina",
        "North-Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Puerto-Rico",
        "Rhode-Island",
        "South-Carolina",
        "South-Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West-Virginia",
        "Wisconsin",
        "Wyoming"
    ]

    //Changing element on DOM
    const title = document.querySelector('.title')
    const title_main = document.querySelector('.title_main')
    const title_span = document.querySelector('.title_span')
    const title_resident = document.querySelector('.title_resident')
    const state_to_change = document.querySelectorAll('.state_to_change')
    const resident = document.querySelector('.resident')
    const percent = document.querySelector('.percent')
    const jobs_created = document.querySelector('.jobs_created')
    const export_amount = document.querySelector('.export_amount')
    const import_amount = document.querySelector('.import_amount')
    const total_job = document.querySelector('.total_job')
    const total_job_value = document.querySelector('.total_job span')
    const export_label = document.querySelectorAll('.export_label')
    const import_label = document.querySelectorAll('.import_label')
    const company_list = document.querySelector('.company_list')
    const large_card = document.querySelector('.large_card')
    const export_service_card = document.querySelector('.export_service_card')
    const import_service_card = document.querySelector('.import_service_card')
    const export_service_bar_info = document.querySelector('.export_service_card .bar_info')
    const import_service_bar_info = document.querySelector('.import_service_card .bar_info')
    const pdf = document.querySelector('.pdf')

    //Canvas
    const employement_canvas = document.getElementById('employement_canvas')
    const jobs_canvas = document.getElementById('jobs_canvas')
    const export_canvas = document.getElementById('export_canvas')
    const import_canvas = document.getElementById('import_canvas')
    const doughnut_info = document.querySelector('.doughnut_info')
    const employment_bar_info = document.querySelector('.employment_card .bar_info')
    const export_bar_info = document.querySelector('.export_card .bar_info')
    const import_bar_info = document.querySelector('.import_card .bar_info')
    const export_service_canvas = document.getElementById('export_service_canvas')
    const import_service_canvas = document.getElementById('import_service_canvas')

    //Animate chart on scroll
    const export_card = document.querySelector('.export_card')

    //Smartphone-Tablet

    const explore_btn = document.querySelector('.explore_btn')
    const menu = document.querySelector('.menu')
    const menu_line1 = document.getElementById('menuLine1')
    const menu_line2 = document.getElementById('menuLine2')
    const menu_line3 = document.getElementById('menuLine3')
    let menus_statu = false

    //Charts 

    let employment = null
    let data_employment = null
    let config_employment = null

    let jobs = null
    let data_jobs = null
    let config_jobs = null

    let export_chart = null
    let data_export = null
    let config_export = null

    let import_chart = null
    let data_import = null
    let config_import = null
    
    let export_service = null
    let import_service = null

    /*LOADING ANIMATION */
    /* */
    /* */

    const loaderAnim = gsap.timeline({
        paused:true,
        repeat:-1,
        duration:1,
        yoyo:true,
        defaults:{
            duration:0.2
        }
    })
    loaderAnim.duration(1)
    loaderAnim.repeatDelay(0)

    loaderAnim
    .to(circles,{
        keyframes:[
            {autoAlpha:1,scale:1.5},
            {autoAlpha:0,scale:1,}
        ],
        stagger:0.1
    })

    loaderAnim.play()

    /*GENERAL FUNCTION */
    /* */
    /* */

    window.addEventListener('popstate', () => { //Handle back page and next page browser
        let page = window.location.hash.replace('#','')
        if(page===''){
            reset()
        }else{
            let link = document.querySelector(`[data-name = ${page}]`)
            showDataFromList(link)
        }

    })
    
    function updateDOM(data){ //Build the canvas and the DOM elements
        gsap.to(title_resident,{autoAlpha:1})
        gsap.to(pdf,{autoAlpha:1})
        state_to_change.forEach(e=>{e.innerText = data.state})
        resident.innerText = data.resident
        percent.innerText = data.percent
        jobs_created.innerText = data.jobs_created
        export_amount.innerText = data.export_amount
        import_amount.innerText = data.import_amount
        
        configCharts(data) //Create all config of charts
        pdf.href = `/wp-content/uploads/download/${data.state} 2025 Swiss Impact.pdf`
        if(employment === null || employment.ctx === null){ //If charts does not exists OR have been destroyed
            
            data_employment.datasets[0].backgroundColor[data.index_color] = 'rgb(228, 16, 28)'
            employment = new Chart(employement_canvas,config_employment)
            
            if(window.matchMedia("(min-width: 1024px)").matches){  //Create jobs chart
                jobs = new Chart(jobs_canvas.getContext('2d'),config_jobs)
            }
        }else{ //Charts exists and must be update (click from list)
            
            //Employment chart
            employment.reset()
            employment.options.scales.y.max = Math.max(...data.employment)*1.2 // define max size of Y axis on employement graph
            employment.data.datasets[0].data = data.employment //Set all data of the chart
            employment.data.datasets[0].backgroundColor = ['rgb(157, 157, 156)','rgb(157, 157, 156)','rgb(157, 157, 156)','rgb(157, 157, 156)','rgb(157, 157, 156)'] // reset the bar's color
            employment.data.datasets[0].backgroundColor[data.index_color] = 'rgb(228, 16, 28)'
            employment.data.labels = data.employment_label
            employment.update()
            
            if(window.matchMedia("(min-width: 1024px)").matches){ //update jobs chart
                jobs.data.datasets[0].data = data.jobs
                jobs.reset()
                jobs.update()
            }

        }

        gsap.to(employment_bar_info,{delay:0.3,autoAlpha:1}) //Show text below employment canvas
        gsap.to(doughnut_info,{delay:0.3,autoAlpha:1}) //Show text below jobs canvas

        if(window.matchMedia("(min-width: 1024px)").matches){ //show Total jobs number on computer
            gsap.to(total_job,{delay:0.3,autoAlpha:1}) 
            gsap.to(total_job_value,{text:{value:sumTotalJob(data.jobs)}})
        }

        if(data.state === "United States"){
            try {
                createUSCharts(data)
            } catch (error) {
                throw error
            }
            large_card.style.display = "none"
        }else{
            export_service_card.style.display = "none"
            import_service_card.style.display = "none"    
            large_card.style.display = "flex"
            setTimeout(() => {
                document.querySelectorAll('.company-list').forEach(e => e.remove()); // Remove all previous companies
            
                let companies = [...data.companies].sort(); // Trie alphabétiquement
                let columns = 2; // Par défaut (mobile)
            
                const width = window.innerWidth; // Récupérer la largeur d'écran
                console.log(width)
                if(width >= 1400){
                    columns = 5;
                }else if(width >= 1200){
                    columns = 4;
                }else if(width <= 1200 && width >= 900){
                    columns = 3;
                }else if(width <= 900){
                    columns = 2;
                } 
            
                let chunkSize = Math.ceil(companies.length / columns); // Divise en colonnes
                console.log(chunkSize,columns)
                let chunks = [];
                // Découper le tableau en plusieurs sous-tableaux
                for (let i = 0; i < companies.length; i += chunkSize) {
                    chunks.push(companies.slice(i, i + chunkSize));
                }
            
                // Créer et insérer les <ul> et <li>
                chunks.forEach(chunk => {
                    let ul = document.createElement('ul');
                    ul.classList.add('company-list'); // Ajoute une classe au <ul> (utile pour le style)
            
                    chunk.forEach(company => {
                        let li = document.createElement('li');
                        li.innerText = company;
                        li.classList.add('company');
                        ul.appendChild(li);
                    });
            
                    document.querySelector('.companies').appendChild(ul); // Ajoute chaque <ul> au parent
                });
            
            }, 500);            
        }

        if(data.state === "District of Columbia"){
            document.querySelector('.largeCard_title span').innerText = "the District of Columbia"
        }
        
    }
    
    function configCharts(data){ //Charts configuration
        let maxYAxis = Math.max(...data.employment)*1.2
        let maxXAxis_export = null
        let maxXAxis_import = null
        let barThickness = null
        let borderRadius = null
        let offset = null
        let font = null
        let padding = null
        
        if(window.matchMedia("(min-width: 1024px)").matches){
            maxXAxis_export = Math.max(...data.export)*1.35
            maxXAxis_import = Math.max(...data.import)*1.35    
            barThickness = (window.innerWidth*2.5)/100
            borderRadius = 5
            offset = (window.innerWidth*1.042)/100
            font = (window.innerWidth*0.833)/100
            padding = {
                top:(window.innerWidth*0.260)/100,
                bottom:(window.innerWidth*0.260)/100,
                left:(window.innerWidth*0.781)/100,
                right:(window.innerWidth*0.781)/100,
            }
        }else{
            maxXAxis_import = Math.max(...data.import)*1.7    
            maxXAxis_export = Math.max(...data.export)*1.7
            barThickness = (window.innerWidth*4.68)/100
            borderRadius = 2.5
            offset = (window.innerWidth*2.084)/100
            font = (window.innerWidth*3.889)/100
            padding = {
                top:(window.innerWidth*0.520)/100,
                bottom:(window.innerWidth*0.520)/100,
                left:(window.innerWidth*1.562)/100,
                right:(window.innerWidth*1.562)/100,
            }
            data.employment_label = data.employment_label_short
        }
        
        //Employment chart
        data_employment = { // data set-up of employment chart
            labels:data.employment_label,
            datasets: [
            {
                data: data.employment,
                barThickness : barThickness,
                borderRadius:{
                    topLeft:borderRadius,
                    topRight:borderRadius
                },
                backgroundColor: [ // change
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)'
                ],
                datalabels: {
                    anchor: 'end',
                    align:"top",
                    offset:offset
                }
            }]
        }
        config_employment = { // config of employment chart
            type: 'bar',
            data: data_employment,
            options: {
                onResize:(chart)=>{
                    chart.options.scales.x.ticks.font.size = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.833)/100:(window.innerWidth*3.889)/100
                    chart.data.datasets[0].barThickness = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*2.5)/100:(window.innerWidth*6)/100
                    chart.options.plugins.datalabels.font.size = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.833)/100:(window.innerWidth*3.889)/100
                    chart.data.datasets[0].datalabels.offset= (window.innerWidth*1.042)/100
                    chart.options.plugins.datalabels.padding = {
                        top:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        bottom:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        left:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                        right:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                    }
                } ,
                responsive:true,
                aspectRatio:window.matchMedia("(min-width: 1024px)").matches?1.7:1.02,
                plugins:{
                    datalabels:{
                        formatter: function(value) {
                            if(value>=100000) return value.toString().slice(0,3)+","+value.toString().slice(3)
                            if(value>=10000) return value.toString().slice(0,2)+","+value.toString().slice(2)
                            if(value>=1000) return value.toString().slice(0,1)+","+value.toString().slice(1)
                        },    
                        backgroundColor : "#FFF",
                        color : "#000",
                        borderRadius:borderRadius,
                        padding:padding,
                        borderWidth:1,
                        borderColor: "#EDEEEE",
                        font:{
                            size:font,
                        }
                    },    
                    legend:{
                        display:false,
                    },
                    tooltip:{
                        enabled:false,
                    }
                },
                scales: {
                    y: {
                        max : maxYAxis,
                        beginAtZero: true,
                        ticks:{
                            display:false,
                        },
                        grid:{
                            display:false,
                            drawTicks:false,
                            drawBorder:false,
                        },
                    },
                    x:{
                        alignToPixels:true,
                        grid:{
                            display:false,
                            drawBorder:false,
                        },
                        ticks:{
                            font:{
                                size:font
                            },
                        }
                    }
                },
                animation:{
                    duration:2000
                },
            },
        }
        //Jobs chart (doughnut)
        data_jobs = { //data set up of jobs chart
            datasets: [{
                data: data.jobs, //Change
                backgroundColor: [
                    'rgb(228, 16, 28)',
                    'rgb(241, 130, 98)',
                    'rgb(249, 197, 175)'
                ],
                datalabels: {
                    anchor: 'end',
                    padding:padding,
                },
                hoverOffset: 0,
                cutout:'60%',
                radius:'80%',
                circumference:360,
                animateRotate:true,
                animateScale:true,
            }]
            }
        config_jobs = { //config of jobs chart
        type: 'doughnut',
        data: data_jobs,
        options: {
            onResize:(chart)=>{
                chart.options.plugins.datalabels.font.size = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.833)/100:(window.innerWidth*3.889)/100
                chart.options.plugins.datalabels.padding = {
                    top:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                    bottom:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                    left:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                    right:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
            }
            },
            aspectRatio:window.matchMedia("(min-width: 1024px)").matches? 1.6: 1,
            responsive:true,
            layout:{
                padding:{
                    top:0
                }
            },
            plugins: {
                datalabels:{
                    formatter: function(value) {
                        if(value>=100000) return value.toString().slice(0,3)+","+value.toString().slice(3)
                        if(value>=10000) return value.toString().slice(0,2)+","+value.toString().slice(2)
                        if(value>=1000) return value.toString().slice(0,1)+","+value.toString().slice(1)
                    },
                    backgroundColor : "#FFF",
                    color : "#000",
                    borderRadius:borderRadius,
                    borderWidth:1,
                    borderColor: "#EDEEEE",
                    font: {
                        size:font
                    },
                },
                title: {
                display: false,
                },
                legend: {
                    display: false,
                },
                tooltip:{
                    enabled:false,
                }
            },
            animation:{
                duration:2000
            }
        },
    }
    //Export bar chart
    data_export = { //Data set up for export bar chart
        labels:data.export_label,
        datasets:[{
            data:data.export,
            backgroundColor:'rgb(157, 157, 156)',
            barThickness : barThickness,
            borderRadius:{
                    topRight:borderRadius,
                    bottomRight:borderRadius
                },
                datalabels: {
                    anchor: 'end',
                    align:"right",
                    offset:offset
                }
            }]
        }
        config_export = {
            type:'bar',
            data:data_export,
            options:{
                onResize:(chart)=>{
                    chart.data.datasets[0].barThickness = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*2.5)/100:(window.innerWidth*6)/100
                    chart.options.plugins.datalabels.font.size = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.833)/100:(window.innerWidth*3.889)/100
                    chart.data.datasets[0].datalabels.offset= (window.innerWidth*1.042)/100
                    chart.options.plugins.datalabels.padding = {
                        top:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        bottom:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        left:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                        right:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                    }
                } ,
                aspectRatio:window.matchMedia("(min-width: 1024px)").matches?1.1:0.5,
                indexAxis: 'y',
                responsive:true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks:{
                            display:false,
                        },
                        grid:{
                            display:false,
                            drawTicks:false,
                            drawBorder:false,
                        },
                    },
                    x:{
                        max:maxXAxis_export,
                        grid:{
                            display:false,
                            drawBorder:false,
                        },
                        ticks:{
                            display:false,
                        }
                    }
                },
                plugins:{
                    datalabels:{
                        formatter: function(value, context) {
                                if(value>=1000){
                                    return "$ "+value/1000+" B"
                                }else if(value<1){
                                    return "$ "+value*1000+" K"
                                }
                                else{
                                    return "$ "+value+" M"
                                }
                            },
                        backgroundColor : "#FFF",
                        color : "#000",
                        borderRadius:borderRadius,
                        padding:padding,
                        borderWidth:1,
                        borderColor: "#EDEEEE",
                        font:{
                            size:font,
                        }
                    }, 
                    legend:{
                        display:false,
                    },
                    tooltip:{
                        enabled:false,
                    }
                },
                animation:{
                    duration:2000
                }
            }
        }
        //Import bar chart
        data_import = { //Data set up for export bar chart
            labels:data.import_label,
            datasets:[{
                data:data.import,
                backgroundColor:'rgb(157, 157, 156)',
                barThickness : barThickness,
                borderRadius:{
                    topRight:borderRadius,
                    bottomRight:borderRadius
                },
                datalabels: {
                    anchor: 'end',
                    align:"right",
                    offset:offset
                }
            }]
        }
        config_import = {
            type:'bar',
            data:data_import,
            options:{
                onResize:(chart)=>{
                    chart.data.datasets[0].barThickness = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*2.5)/100:(window.innerWidth*6)/100
                    chart.options.plugins.datalabels.font.size = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.833)/100:(window.innerWidth*3.889)/100
                    chart.data.datasets[0].datalabels.offset= (window.innerWidth*1.042)/100
                    chart.options.plugins.datalabels.padding = {
                        top:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        bottom:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        left:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                        right:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                    }
                } ,
                aspectRatio:window.matchMedia("(min-width: 1024px)").matches?1.1:0.5,
                indexAxis: 'y',
                responsive:true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks:{
                            display:false,
                        },
                        grid:{
                            display:false,
                            drawTicks:false,
                            drawBorder:false,
                        },
                    },
                    x:{
                        max:maxXAxis_import,
                        grid:{
                            display:false,
                            drawBorder:false,
                        },
                        ticks:{
                            display:false,
                        }
                    }
                },
                plugins:{
                    datalabels:{
                        formatter: function(value, context) {
                            if(value>=1000){
                                return "$ "+value/1000+" B"
                            }else if(value<1){
                                return "$ "+value*1000+" K"
                            }
                            else{
                                return "$ "+value+" M"
                            }
                        },
                        backgroundColor : "#FFF",
                        color : "#000",
                        borderRadius:borderRadius,
                        padding:padding,
                        borderWidth:1,
                        borderColor: "#EDEEEE",
                        font:{
                            size:font,
                        }
                    }, 
                    legend:{
                        display:false,
                    },
                    tooltip:{
                        enabled:false,
                    }
                },
                animation:{
                    duration:2000
                }
            }
        }
    }
    
    function createUSCharts(data){ //Exclusif U.S Charts configuration
        let barThickness = null
        let borderRadius = null
        let offset = null
        let font = null
        let padding = null
        
        if(window.matchMedia("(min-width: 1024px)").matches){
            barThickness = (window.innerWidth*2.5)/100
            borderRadius = 5
            offset = (window.innerWidth*1.042)/100
            font = (window.innerWidth*0.833)/100
            padding = {
                top:(window.innerWidth*0.260)/100,
                bottom:(window.innerWidth*0.260)/100,
                left:(window.innerWidth*0.781)/100,
                right:(window.innerWidth*0.781)/100,
            }
        }else{
            barThickness = (window.innerWidth*4.68)/100
            borderRadius = 2.5
            offset = (window.innerWidth*2.084)/100
            font = (window.innerWidth*3.889)/100
            padding = {
                top:(window.innerWidth*0.520)/100,
                bottom:(window.innerWidth*0.520)/100,
                left:(window.innerWidth*1.562)/100,
                right:(window.innerWidth*1.562)/100,
            }
        }
        
        export_service_card.style.display = "flex"
        import_service_card.style.display = "flex"
        
        
        //Export service config
        const export_service_data = { 
            labels:data.export_service_label,
            datasets: [
            {
                data: data.export_service,
                barThickness : barThickness,
                borderRadius:{
                    topLeft:borderRadius,
                    topRight:borderRadius
                },
                backgroundColor: [
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)'
                    ],
                datalabels: {
                    anchor: 'end',
                    align:"top",
                    offset:offset
                }
            }]
        }
        const export_service_config ={ // config of employment chart
            type: 'bar',
            data: export_service_data,
            options: {
                onResize:(chart)=>{
                    chart.data.datasets[0].barThickness = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*2.5)/100:(window.innerWidth*6)/100
                    chart.options.plugins.datalabels.font.size = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.833)/100:(window.innerWidth*3.889)/100
                    chart.data.datasets[0].datalabels.offset= (window.innerWidth*1.042)/100
                    chart.options.plugins.datalabels.padding = {
                        top:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        bottom:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        left:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                        right:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                    }
                } ,
                responsive:true,
                aspectRatio:window.matchMedia("(min-width: 1024px)").matches?2.15:1.2,
                plugins:{
                    datalabels:{
                        formatter: function(value, context) {
                            if(value>=1000){
                                return "$ "+value/1000+" B"
                            }else if(value<1){
                                return "$ "+value*1000+" K"
                            }
                            else{
                                return "$ "+value+" M"
                            }
                        },
                        backgroundColor : "#FFF",
                        color : "#000",
                        borderRadius:borderRadius,
                        padding:padding,
                        borderWidth:1,
                        borderColor: "#EDEEEE",
                        font:{
                            size:font,
                        }
                    },    
                    legend:{
                        display:false,
                    },
                    tooltip:{
                        enabled:false,
                    }
                },
                scales: {
                    y: {
                        max : Math.max(...data.export_service)*1.3 ,
                        beginAtZero: true,
                        ticks:{
                            display:false,
                        },
                        grid:{
                            display:false,
                            drawTicks:false,
                            drawBorder:false,
                        },
                    },
                    x:{
                        alignToPixels:true,
                        grid:{
                            display:false,
                            drawBorder:false,
                        },
                        ticks:{
                            display:false,
                        }
                    }
                },
                animation:{
                    duration:2000
                },
            },
        }
        
        //Import service config
        
        const import_service_data = { // data set-up of employment chart
            labels:data.import_service_label,
            datasets: [
            {
                data: data.import_service,
                barThickness : barThickness,
                borderRadius:{
                    topLeft:borderRadius,
                    topRight:borderRadius
                },
                backgroundColor: [
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)',
                    'rgb(157, 157, 156)'
                    ],
                    datalabels: {
                        anchor: 'end',
                        align:"top",
                        offset:offset
                    }
                }]
            }
            const import_service_config = { // config of employment chart
                type: 'bar',
                data: import_service_data,
                options: {
                onResize:(chart)=>{
                    chart.data.datasets[0].barThickness = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*2.5)/100:(window.innerWidth*6)/100
                    chart.options.plugins.datalabels.font.size = window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.833)/100:(window.innerWidth*3.889)/100
                    chart.data.datasets[0].datalabels.offset= (window.innerWidth*1.042)/100
                    chart.options.plugins.datalabels.padding = {
                        top:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        bottom:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.260)/100:(window.innerWidth*0.520)/100,
                        left:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                        right:window.matchMedia("(min-width: 1024px)").matches?(window.innerWidth*0.781)/100:(window.innerWidth*1.536)/100,
                    }
                } ,
                responsive:true,
                aspectRatio:window.matchMedia("(min-width: 1024px)").matches?2.15:1.2,
                plugins:{
                    datalabels:{
                        formatter: function(value, context) {
                            if(value>=1000){
                                return "$ "+value/1000+" B"
                            }else if(value<1){
                                return "$ "+value*1000+" K"
                            }
                            else{
                                return "$ "+value+" M"
                            }
                        },
                        backgroundColor : "#FFF",
                        color : "#000",
                        borderRadius:borderRadius,
                        padding:padding,
                        borderWidth:1,
                        borderColor: "#EDEEEE",
                        font:{
                            size:font,
                        }
                    },    
                    legend:{
                        display:false,
                    },
                    tooltip:{
                        enabled:false,
                    }
                },
                scales: {
                    y: {
                        max : Math.max(...data.import_service)*1.3 ,
                        beginAtZero: true,
                        ticks:{
                            display:false,
                        },
                        grid:{
                            display:false,
                            drawTicks:false,
                            drawBorder:false,
                        },
                    },
                    x:{
                        alignToPixels:true,
                        grid:{
                            display:false,
                            drawBorder:false,
                        },
                        ticks:{
                            display:false,
                        }
                    }
                },
                animation:{
                    duration:2000
                },
            },
        }

        if(window.matchMedia("(min-width: 1024px)").matches){
            datas_window.addEventListener('scroll',()=>{
                let y = export_card.getBoundingClientRect().y
                let trigger = window.innerHeight*0.8/100
                if(y<=trigger){
                    if(export_service === null || export_service.ctx === null){
                        export_service = new Chart(export_service_canvas.getContext('2d'),export_service_config)
                        import_service = new Chart(import_service_canvas.getContext('2d'),import_service_config)
                        gsap.to(export_service_bar_info,{autoAlpha:1})
                        gsap.to(import_service_bar_info,{autoAlpha:1})
                    }else{
                        return
                    }
                }    
            })
        }else{
            datas_window.addEventListener('scroll',()=>{
                let y = export_card.getBoundingClientRect().y
                let triggerExport = -window.innerHeight*100/100
                let triggerImport = -window.innerHeight*160/100
                if(y<=triggerImport){
                    if(import_service === null || import_service.ctx === null){
                        gsap.to(import_service_bar_info,{autoAlpha:1})
                        import_service = new Chart(import_service_canvas.getContext('2d'),import_service_config)
                    }else{
                        return
                    }
                }else if(y<=triggerExport){
                    if(export_service === null || export_service.ctx === null){
                        gsap.to(export_service_bar_info,{autoAlpha:1})
                        export_service = new Chart(export_service_canvas.getContext('2d'),export_service_config)
                    }else{
                        return
                    }
                    
                }    
            })
        }

    }
    
    function fetchStateData(name){ //Call the JSON file, fetch datas and change the DOM
        let timeout_loader = {
            setup(){ 
                this.timeoutID = setTimeout(()=>{
                    gsap.to(loader,{autoAlpha:1})
                    loaderAnim.play()
                },500)
            },
            cancel(){clearInterval(this.timeoutID)}
        }
        timeout_loader.setup()

        let promise = new Promise(function(resolved,rejected){
            let ajax = new XMLHttpRequest()
            let url = "states/"+name+".json"
            ajax.open("GET",url,true)
            ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            ajax.onload = function(){
                if(this.status === 200){
                    resolved(this.response)
                }else{
                    rejected("Datas could not be retrieved")
                }
            }
            ajax.send()
        })

        let timeout = new Promise(function(resolved){
            setTimeout(function(){
                resolved()
            },5000)
        })

        async function ajaxAsync(){
            try {
                let data = await Promise.race([promise,timeout])
                if(data === undefined){
                    throw new Error("Please check internet connection")
                }else{
                    data = JSON.parse(data)
                    try {
                        updateDOM(data)
                    } catch (error) {
                        throw new Error("Could not fetch datas")
                    }
                    timeout_loader.cancel()
                    gsap.to(loader,{autoAlpha:0})                
                }
            } catch (error) {
                loaderAnim.paused()
                gsap.to(loader,{autoAlpha:0})                
                handleError(error)
            }
        }
        
        ajaxAsync()
        loaderAnim.paused()
    }

    function buildList(){ //Build list of states and add the event listener
        state_array.forEach(e=>{
            let li = document.createElement('li')
            let a = document.createElement('a')
            a.href = `#${e}`
            a.rel = 'self'
            a.innerText = e.replace(/-/gm," ")
            li.tabIndex = 0
            li.dataset.name = e
            li.appendChild(a)
            state_list.append(li)
            li.addEventListener('click',function(){
                showDataFromList(li)
            })
        })
        all_state_list = document.querySelectorAll('nav ul li')
    }

    function showDataFromList(el){ //Show the data window from the list
        export_chart===null?null:export_chart.destroy()
        import_chart===null?null:import_chart.destroy()
        export_service===null?null:export_service.destroy()
        import_service===null?null:import_service.destroy()    

        export_label.forEach(e=>gsap.to(e,{autoAlpha:0}) ) //hide labels on horizontal charts to show later      
        import_label.forEach(e=>gsap.to(e,{autoAlpha:0}) )
        gsap.to(export_service_bar_info,{autoAlpha:0})
        gsap.to(import_service_bar_info,{autoAlpha:0})    
            
        let actifLi = document.querySelector('.li_active') //Activate the li in red
        actifLi? actifLi.classList.remove('li_active'):null
        el.classList.add('li_active')

        if(window.matchMedia("(max-width: 1023px)").matches){ //Hide menu on smartphone
            menus_statu=false
            gsap.to(menu_line1,{attr:{y1:25.11,y2:25,x1:20.5,x2:60.5}})      
            gsap.to(menu_line2,{attr:{y1:37.11,y2:37,x1:27.5,x2:52.5}})      
            gsap.to(menu_line3,{autoAlpha:1})          
            gsap.to(aside,{duration:1,y:"-50rem"})
            gsap.to(map,{display:"none",autoAlpha:0})
            gsap.to(title,{flexFlow:"row wrap",alignItems:"center",boxShadow:"var(--shadow_label)",paddingLeft:"5%"})
            title_main.innerText = el.dataset.name.replace(/-/gm," ")
            title_main.classList.add('state_name')
        } 
        
        if(datas_window_statu){ //data window already open
            datas_window.scrollTo(0,0)
            if(window.matchMedia("(max-width: 1023px)").matches){ //smartphone
                jobs===null? null:jobs.destroy()
                gsap.to(total_job,{autoAlpha:0})    
            }
            gsap.to(title_span,{
                autoAlpha:1,
                text:{
                    value:el.dataset.name.replace(/-/gm," ")
                }
            })
            fetchStateData(el.dataset.name)
        }else{ //data window close
            gsap.to(aside,{height:window.matchMedia("(max-width: 1023px)").matches? null:"83%"})
            gsap.to(map,{delay:0.2,autoAlpha:0})
            gsap.to(title_span,{
                autoAlpha:1,
                text:{
                    value:el.dataset.name.replace(/-/gm," ")
                }
            })
            gsap.to(datas_window,{
                duration:1,
                y: window.matchMedia("(max-width: 1023px)").matches?"3%": "-101%",
                autoAlpha:1,
                onComplete:()=>{
                    datas_window_statu=true
                    title.style.boxShadow = "0px 0.512vw 1.042vw rgba(146, 146, 146, 0.1)"
                    fetchStateData(el.dataset.name)  
                }
            })
        }
    }

    function reset(){ //Reset state of the DOM
        if(!datas_window_statu) return
        gsap.to(aside,{height:"90%"})
        datas_window.scrollTo(0,0)
        datas_window_statu = false

        search_state.value = ""
        all_state_list.forEach(e=>e.style.display = "block")

        gsap.to(map,{autoAlpha:1})
        gsap.to(pdf,{autoAlpha:0})
        gsap.to(employment_bar_info,{autoAlpha:0})
        gsap.to(doughnut_info,{autoAlpha:0})
        gsap.to(total_job,{autoAlpha:0})
        if(window.matchMedia("(max-width: 1023px)").matches){
            gsap.to(aside,{duration:1,y:"5rem"})
        }
        gsap.to(datas_window,{duration:1,y:"-0%"})
        gsap.to(title_span,{autoAlpha:0,text:{value:""}})
        gsap.to(title_resident,{autoAlpha:0})

        export_label.forEach(e=>gsap.to(e,{autoAlpha:0}) )       
        import_label.forEach(e=>gsap.to(e,{autoAlpha:0}) )

        gsap.to(export_service_bar_info,{autoAlpha:0})
        gsap.to(import_service_bar_info,{autoAlpha:0})

        document.querySelectorAll('.company').forEach(e=>e.remove()) //Remove all company name from list

        title.style.boxShadow = 'none'

        let actifLi = document.querySelector('.li_active')//reset li :actif
        actifLi? actifLi.classList.remove('li_active'):null

        employment===null? null:employment.destroy()
        jobs===null? null:jobs.destroy()
        export_chart===null?null:export_chart.destroy()
        import_chart===null?null:import_chart.destroy()
        export_service===null?null:export_service.destroy()
        import_service===null?null:import_service.destroy()
    }

    function handleError(error){ //Handle errors
        console.error(error)
        gsap.to(error_window,{autoAlpha:1, duration:1,y:100})
        error_text.innerText = error
        setTimeout(()=>{gsap.to(error_window,{duration:1,autoAlpha:0, y:0})},2500)
        if(window.matchMedia("(min-width: 1024px)").matches){
            reset()
        }
    }

    function sumTotalJob(num){ //sum of totals jobs
        let i = 0
        let sum = 0
        for (i; i <= 2; i++) {
            sum = sum+num[i]
        }
        if(sum>=100000) return sum.toString().slice(0,3)+","+sum.toString().slice(3)
        if(sum>=10000) return sum.toString().slice(0,2)+","+sum.toString().slice(2)
        if(sum>=1000) return sum.toString().slice(0,1)+","+sum.toString().slice(1)
        if(sum<1000) return sum
    }
    
    const previousY = (function(y) { //Return if scrolling event goes up or down
        let prevY=0
        return function(y) {
            let diff = prevY -y;
            prevY = y
            return diff
        }
    })()


    /*EVENTS */
    /* */
    /* */
    
    search_state.addEventListener('input',function(){ //Search bar
        try {
            let regex = new RegExp(this.value,'i')
            if(this.value===""){
                all_state_list.forEach(e=>e.style.display = "block")
            }else{
                all_state_list.forEach(e=>{
                    if(e.dataset.name.match(regex)){
                        e.style.display = 'block'
                    }else{
                        e.style.display = 'none'
                    }
                })
            }
        } catch (error) {
            all_state_list.forEach(e=>e.style.display = "block")
        }
    })

    search_state.addEventListener('keydown',(event)=>{ //Show all states on Backspace key press
        if(event.key === "Backspace"){
            all_state_list.forEach(e=>e.style.display = "block")
        }
    })
    
    /*COMPUTER EVENTS */
    /* */
    /* */

    if(window.matchMedia("(min-width: 1024px)").matches){
        
        //Show and animate the horizontal bar charts on computer
        datas_window.addEventListener('scroll',()=>{
            let y = export_card.getBoundingClientRect().y
            if(previousY(y)>0){
                let trigger = window.innerHeight*50/100
                if(y<=trigger){
                    if(export_chart === null || export_chart.ctx === null){ //Does not exists
                        export_chart = new Chart(export_canvas.getContext('2d'),config_export)
                        import_chart = new Chart(import_canvas.getContext('2d'),config_import)
                    }else{ // Exists and is not empty
                        return 
                    }
        
                    for (let i = 0; i < export_label.length; i++) { //Show export labels
                        gsap.to(export_label[i],{delay:0.1,autoAlpha:1,text:{value:config_export.data.labels[i]}})            
                    }
                    for (let i = 0; i < import_label.length; i++) { //Show import labels
                        gsap.to(import_label[i],{delay:0.1,autoAlpha:1, text:{value:config_import.data.labels[i]}})            
                    }
                    gsap.to(export_bar_info,{delay:0.3,autoAlpha:1}) //Show text below export canvas
                    gsap.to(import_bar_info,{delay:0.3,autoAlpha:1}) //Show text below import canvas
                }
            }
        })

        /*STATE LABEL */
        /* */
        /* */

        //Show label with state's name
        state.forEach(e=>{
            e.addEventListener('mouseover',function(){
                state_label.style.display = 'flex'
                state_label.innerText = this.dataset.name.replace(/-/gm," ")
            })
        })
    
        //Hide label with state's name
        state.forEach(e=>{
            e.addEventListener('mouseleave',()=>state_label.style.display = 'none')
        })
    
        //Give position of state's label
        window.addEventListener('mousemove',(event)=>{
            let x = event.clientX+25
            let y = event.clientY-25
            state_label.style.left = x+"px"
            state_label.style.top = y+"px"
        })

        //Washington DC label
        washington.addEventListener('mouseover',()=>{
            gsap.to(washington,{r:15, duration:0.2})
        })

        washington.addEventListener('mouseleave',()=> gsap.to(washington,{r:10,duration:0.2}))

        /*SHOW DATA WINDOW */
        /* */
        /* */

        //Show the datas windows from the map
        state.forEach(e=>{
            e.addEventListener('click',function(){
                gsap.to(aside,{height:"83%"})
                state_label.style.display = 'none'
                let liToFocus = document.querySelector("nav ul li[data-name = "+this.dataset.name+" ]")
                liToFocus.classList.add('li_active')
                liToFocus.focus()
                gsap.to(map,{delay:0.2,autoAlpha:0})
                gsap.to(title_span,{
                    autoAlpha:1,
                    text:{
                        value:this.dataset.name.replace(/-/gm," ")
                    }
                })
                gsap.to(datas_window,{
                    duration:1,
                    y:"-101%",
                    onComplete:()=>{
                        title.style.boxShadow = "0px 0.512vw 1.042vw rgba(146, 146, 146, 0.1)"
                        datas_window_statu = true
                        fetchStateData(this.dataset.name)  
                    } //Will call animation
                })
            })
        })

        /*BUTTON BACK TO MAP */
        /* */
        /* */

        //Animate button back to map on mouse enter
        back_to_map.addEventListener('mouseover',()=>{
            gsap.to(arrow_svg,{x:0,marginRight:10,autoAlpha:1})
        })
        //Animate button back to map on mouse leave
        back_to_map.addEventListener('mouseleave',()=>{
            gsap.to(arrow_svg,{x:30,marginRight:0,autoAlpha:0})
        })
        //Reset state of the dom
        back_to_map.addEventListener('click',()=>{
            reset()
        })
        //Back to home when clicking logo
        logo.addEventListener('click',()=>{
            reset()
        })
}

    /*SMARTPHONE EVENTS */
    /* */
    /* */

    if(window.matchMedia("(max-width: 1023px)").matches){

        datas_window.addEventListener('scroll',()=>{ // Show canvas on Smartphone
            let y = export_card.getBoundingClientRect().y
            let triggerJob = window.innerHeight*130/100
            let triggerExport = window.innerHeight*50/100
            let triggerImport = window.innerHeight*10/100
            if(previousY(y)>0){
                if(y<=triggerImport){
                    if(import_chart === null || import_chart.ctx === null){
                        import_chart = new Chart(import_canvas.getContext('2d'),config_import)
                        for (let i = 0; i < import_label.length; i++) { //Show import labels
                            gsap.to(import_label[i],{delay:0.1,autoAlpha:1, text:{value:config_import.data.labels[i]}})            
                        }
                        gsap.to(import_bar_info,{delay:0.3,autoAlpha:1}) //Show text below import canvas
                    }else{
                        return
                    }
                }else if(y<=triggerExport){
                    if(export_chart === null || export_chart.ctx === null){
                        export_chart = new Chart(export_canvas.getContext('2d'),config_export)
                        for (let i = 0; i < export_label.length; i++) { //Show export labels
                            gsap.to(export_label[i],{delay:0.1,autoAlpha:1,text:{value:config_export.data.labels[i]}})            
                        }
                        gsap.to(export_bar_info,{delay:0.3,autoAlpha:1}) //Show text below export canvas
                    }else{
                        return
                    }
                }else if(y<=triggerJob){
                    if(jobs === null || jobs.ctx === null){
                        jobs = new Chart(jobs_canvas.getContext('2d'),config_jobs)
                        gsap.to(total_job,{delay:0.3,autoAlpha:1}) 
                        gsap.to(total_job_value,{text:{value:sumTotalJob(data_jobs.datasets[0].data)}})        
                    }else{
                        return
                    }
                }
            }
        })

        //Show title for smartphone
        gsap.to(title_span,{text:{value:"IN THE UNITED STATES"}})

        /*SMARTPHONE MENU */
        /* */
        /* */

        function openMenu(){
            gsap.to(explore_btn,{autoAlpha:0})
            gsap.to(aside,{duration:1,y:80})
            menus_statu = true
            gsap.to(menu_line1,{attr:{y1:54.18,y2:25.82,x1:25.9,x2:54.1}})      
            gsap.to(menu_line2,{attr:{y1:26.02,y2:53.98,x1:25.9,x2:54.1}})      
            gsap.to(menu_line3,{autoAlpha:0})      
        }

        function closeMenu(){
            gsap.to(explore_btn,{autoAlpha:1})
            gsap.to(aside,{duration:1,y:"-50rem"})
            menus_statu = false
            gsap.to(menu_line1,{attr:{y1:25.11,y2:25,x1:20.5,x2:60.5}})      
            gsap.to(menu_line2,{attr:{y1:37.11,y2:37,x1:27.5,x2:52.5}})      
            gsap.to(menu_line3,{autoAlpha:1})      
        }

        explore_btn.addEventListener('click',()=>{ //Open menu with main btn
            openMenu()
        })
    
        menu.addEventListener('click',()=>{ //Open close the menu
            if(menus_statu){
                closeMenu()
            }else{
                openMenu()
            }
        })

        //Back to home when clicking logo
        logo.addEventListener('click',()=>{
            search_state.value = ""
            all_state_list.forEach(e=>e.style.display = "block")
            if(datas_window_statu){
                if(menus_statu) closeMenu()
                datas_window_statu = false
                datas_window.scrollTo(0,0)
                gsap.to(title_resident,{autoAlpha:0,duration:0})
                gsap.to(explore_btn,{autoAlpha:1})
                gsap.to(datas_window,{transform:"translateY(125%)",autoAlpha:0})
                gsap.to(map,{display:"flex",autoAlpha:1})
                gsap.to(pdf,{autoAlpha:0})
                gsap.to(title,{flexFlow:"row-reverse wrap-reverse",boxShadow:"none",padding:0})
                title_main.innerHTML = "SWISS ECONOMIC IMPACT<br><span class='title_span'>IN THE UNITED STATES</span>"
                title_main.classList.remove('state_name')
            }else if(!datas_window_statu && menus_statu){
                closeMenu()
            }
        })
    }
    
    buildList() //Show all state on list on load
    
    loaderAnim.paused()
    
})



