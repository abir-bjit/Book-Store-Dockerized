const HTTP_STATUS = require("../constants/statusCodes")
const { validationResult } = require("express-validator");
const {success, failure} = require('../utilities/common')
const DiscountModel = require('../model/Discount');
const ProductModel = require('../model/Product');

class DiscountController{
    async getAllDiscounts(req, res) {
        try {
            const discountCount = await DiscountModel.find({}).count();
            const discounts = await DiscountModel.find({}).populate('product')
            console.log(discounts)
            if (!discounts) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure("No discounts were found"));
            }

            return res.status(HTTP_STATUS.OK).send(
                success("Successfully got all products", {
                    total: discountCount,
                    discounts,
                })
            );
        } catch (error) {
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }

    // gets only one product
    async getOne(request, response){
        try{
            const {id} = request.params
            console.log('id is:', id);
            const product = await ProductModel.find({_id: id})
            console.log('products:', product);
            if(product){
                return response.status(200).send(product[0])
            }else{
                return response.status(400).send(`failed to recieve product`)
            }
        }catch(error){
            return response.status(400).send(`internal server error`)
        }
    }

    // adds
    async addDiscount(req, res){
        try{
            const validation = validationResult(req).array();
            // console.log(validation);
            if (validation.length > 0) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(failure("Failed to add discount", validation[0].msg));
            }

            const {startTime, endTime, percentage, title, productId} = req.body

            const duplicateDiscount = await DiscountModel.find({title: title})

            if(duplicateDiscount.length){
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure(`${title} discount already exists`, 'duplicacy') )
            }

            if(startTime>endTime){
                return res.status(HTTP_STATUS.NOT_FOUND).send(failure(`start time cannot extend end time`, 'wrong limit') )
            }

            const product = await ProductModel.findById({_id: productId})
            console.log(product);
            if(!product){
                return res
                    .status(HTTP_STATUS.NOT_FOUND)
                    .send(failure("Product doesnt exist"));
            }

            const discount = new DiscountModel({
                startTime: startTime, 
                endTime: endTime, 
                percentage: percentage, 
                title: title,
                product: productId
            })

            product.discount = discount._id
            await product.save()
            await discount.save()
            return res
                    .status(HTTP_STATUS.CREATED)
                    .send(success("Discount Added Successfully", discount));
        }catch(error){
            console.log(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }

    // deletes a discount
    async deleteDiscount(req, res){
        try {
            const validation = validationResult(req).array();
            // console.log(validation);
            if (validation.length > 0) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(failure("Failed to delete discount", validation[0].msg));
            }
            const itemId = req.params.id;
            // Find the item by ID and delete it
            const deletedItem = await DiscountModel.findByIdAndDelete(itemId);
            console.log('deleted discount', deletedItem);

            if (!deletedItem) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Item not found' });
            }

            return res
                .status(HTTP_STATUS.ACCEPTED)
                .send(success("Discount deleted successfully", deletedItem));
        } catch (error) {
            console.error(error);
            return res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .send(failure("Internal server error"));
        }
    }

    // updates
    async update(req, res){
        try {   
            const discountId = req.params.id;
            const updatedProductData = req.body;

            const validation = validationResult(req).array();

            if (validation.length > 0) {
                return res
                    .status(HTTP_STATUS.OK)
                    .send(failure("Failed to update data", validation[0].msg));
            }

            const updatedProduct = await DiscountModel.findByIdAndUpdate(
            discountId,
            updatedProductData,
            // Returns the updated document
            { new: true });

            if (!updatedProduct) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Item not found' });
            }
            console.log(updatedProduct);

            return res
                .status(HTTP_STATUS.ACCEPTED)
                .send(success("Discount updated successfully", updatedProduct));
        } catch (error) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL SERVER ERROR' });
        }
    }
}

module.exports =  new DiscountController()