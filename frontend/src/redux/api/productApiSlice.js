import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (pageNumber = "1") => `/api/products?pageNumber=${pageNumber}`,
      keepUnusedDataFor: 0,
      providesTags: (result, error, pageNumber) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product",
                id: _id,
              })),
              { type: "ProductList", id: pageNumber },
            ]
          : [{ type: "ProductList", id: pageNumber }],
    }),
    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/allproducts`,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductsByCategory: builder.query({
      query: (categoryId) => `${PRODUCT_URL}/category/${categoryId}`,
      providesTags: (result, error, categoryId) => [
        { type: "ProductsByCategory", id: categoryId },
      ],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, productData }) => {
        // If productData is already a FormData, use it directly
        if (productData instanceof FormData) {
          return {
            url: `${PRODUCT_URL}/${productId}`,
            method: "PUT",
            body: productData,
          };
        }
    
        // Otherwise, create a new FormData
        const formData = new FormData();
        
        // Append text fields
        Object.keys(productData).forEach(key => {
          if (key !== 'images' && key !== 'existingImages') {
            formData.append(key, productData[key]);
          }
        });
    
        // Append new images
        if (productData.images && productData.images.length > 0) {
          productData.images.forEach((image, index) => {
            formData.append('images', image);
          });
        }
    
        // Append existing image URLs
        if (productData.existingImages && productData.existingImages.length > 0) {
          productData.existingImages.forEach((imageUrl, index) => {
            formData.append('existingImages', imageUrl);
          });
        }
    
        return {
          url: `${PRODUCT_URL}/${productId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),
    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),
    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductsByCategoryQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;