import { Request, Response } from 'express'
import { Connection } from 'typeorm'
import { buildDataLoaders } from '../dataLoaders'
export type Context = {
	req: Request,
	res: Response,
	payload: { userId: number, name: string, email: string },
	connection: Connection,
	dataLoaders: ReturnType<typeof buildDataLoaders>
}