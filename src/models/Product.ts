import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  brand: string;
  stock: number;
  sku: string;
  colors?: string[];
  sizes?: string[];
  ratings: {
    average: number;
    count: number;
  };
  reviews: mongoose.Types.ObjectId[];
  isActive: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    images: [{
      type: String,
      required: true
    }],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category']
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      unique: true,
      required: [true, 'Please provide a SKU']
    },
    colors: [{
      type: String
    }],
    sizes: [{
      type: String
    }],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    tags: [{
      type: String
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Virtual for discount percentage
productSchema.virtual('discount').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

export default mongoose.model<IProduct>('Product', productSchema);
