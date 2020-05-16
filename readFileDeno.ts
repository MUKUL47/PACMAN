import {readFileStrSync} from 'https://deno.land/std/fs/read_file_str.ts'
export function readFile(source : string, options ? : string){
    return readFileStrSync(source, options)
}
