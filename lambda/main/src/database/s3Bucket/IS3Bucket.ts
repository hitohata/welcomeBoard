export interface IS3Bucket {
    putImage(fileName: string): Promise<void>
}
