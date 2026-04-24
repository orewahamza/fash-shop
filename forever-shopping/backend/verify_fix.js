
async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/product/list');
        const data = await res.json();
        console.log("Success:", data.success);
        console.log("Product count:", data.products?.length);
        if (data.products?.length > 0) {
            console.log("First product:", data.products[0].name);
        } else {
            console.log("No products returned.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

test();
