import personas from '../../../../data/personas.json'
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  return NextResponse.json(personas)
}