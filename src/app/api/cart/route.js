import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { connectToDatabase } from '@/lib/mongoose'; // You'll need to implement this
import { User } from '@/models/User'; // You'll need to implement this

export async function GET(req) {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return NextResponse.json([]);
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    return NextResponse.json(user?.cart || []);
}

export async function PUT(req) {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return NextResponse.error('Not authenticated');
    }

    const { cart } = await req.json();
    await connectToDatabase();
    
    await User.updateOne(
        { email: session.user.email },
        { $set: { cart } }
    );

    return NextResponse.json({ success: true });
}
