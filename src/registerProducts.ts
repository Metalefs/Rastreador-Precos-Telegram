import { dbconnection } from "./database";
import { categories } from "./models/categories/detailed";

const products = categories;

export default async function main(){
    await dbconnection().then(db=>{
        try{
            db.collection('products').deleteMany(x=>x?.name);
        }
        catch(ex){

        }
        db.collection('products').insertMany(
            products
        )
    })
}

main();