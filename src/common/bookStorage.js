import file from '@system.file';

function runAsyncFunc(func, params) {
    return new Promise((resolve, reject) => func({
        success: resolve,
        fail: (data, code) => reject({data, code}),
        ...params
    }));
}

const PROGRESS_FILE = 'progress.json';

async function get(bookDirName) {
    const uri = `internal://files/books/${bookDirName}/${PROGRESS_FILE}`;
    try {
        const data = await runAsyncFunc(file.readText, { uri });
        return JSON.parse(data.text);
    } catch (e) {
        return { chapterIndex: null, offsetInChapter: 0, scrollOffset: 0, bookmarks: [], p: 0 };
    }
}

async function set(bookDirName, progressData) {
    const uri = `internal://files/books/${bookDirName}/${PROGRESS_FILE}`;
    await runAsyncFunc(file.writeText, {
        uri,
        text: JSON.stringify(progressData)
    });
}

export default { get, set };
