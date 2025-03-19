import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Ground } from "@/app/models/Ground";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    const updates = await req.json();

    // Validate required fields
    if (updates.title && updates.title.trim() === "") {
      return NextResponse.json(
        { message: "Title cannot be empty" },
        { status: 400 }
      );
    }

    // Check if there are any images left
    if (updates.images && updates.images.length === 0) {
      return NextResponse.json(
        { message: "At least one image is required" },
        { status: 400 }
      );
    }

    // Check pricing information
    if (updates.isPaid === true && (!updates.price || updates.price <= 0)) {
      return NextResponse.json(
        { message: "Price must be provided for paid grounds" },
        { status: 400 }
      );
    }

    // Update the ground with validated data
    const updatedGround = await Ground.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedGround) {
      return NextResponse.json(
        { message: "Ground not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Ground updated successfully", ground: updatedGround },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating ground:", error);
    
    // Handle MongoDB validation errors specifically
    if (error instanceof Error && error.name === "ValidationError" && "errors" in error) {
      const validationErrors = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { message: "Validation error", errors: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to update ground" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch a specific ground by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    const ground = await Ground.findById(id);

    if (!ground) {
      return NextResponse.json(
        { message: "Ground not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ground }, { status: 200 });
  } catch (error) {
    console.error("Error fetching ground:", error);
    
    return NextResponse.json(
      { message: "Failed to fetch ground" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a ground (optional)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    const deletedGround = await Ground.findByIdAndDelete(id);

    if (!deletedGround) {
      return NextResponse.json(
        { message: "Ground not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Ground deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ground:", error);
    
    return NextResponse.json(
      { message: "Failed to delete ground" },
      { status: 500 }
    );
  }
}