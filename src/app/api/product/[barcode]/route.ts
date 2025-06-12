import axios from 'axios';
import { uri_maekhan } from '../../../../../methods/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request, {params}: {params: {barcode: string}}) {

  const {barcode} = params

  try {
    const response = await axios.get(`${uri_maekhan}/api/product/${barcode}`);
    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    )
  }
}