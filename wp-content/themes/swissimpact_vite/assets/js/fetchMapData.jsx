
const fetchMapData = async () => {
    try {
        const res = await fetch('/wp-json/wp/v2/swiss_impact?per_page=100');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        return json;
    } catch (error) {
        console.error("Error fetching map data:", error);
        return [];
    }   
}

export default fetchMapData;