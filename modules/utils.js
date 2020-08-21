export function updateElementWithAtt(elment, attributes){

    for( const key  in attributes){
        elment.setAttribute(key,attributes[key]);
    }

}

export async function dataFromApi(apiUrl) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}