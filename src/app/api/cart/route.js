import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET(req) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return Response.json([]);
        }

        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        return Response.json(user?.cart || []);
    } catch (error) {
        console.error('Error in GET /api/cart:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { cart } = await req.json();
        await connectToDatabase();
        
        await User.updateOne(
            { email: session.user.email },
            { $set: { cart } }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error in PUT /api/cart:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
