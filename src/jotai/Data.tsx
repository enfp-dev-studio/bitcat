// import { Atom, atom } from "jotai";
// import { atomWithStorage, splitAtom } from "jotai/utils";
// import { MemoType, Position } from "../type/Type";
// import { createNewMemoId } from "../util/Util";
// // const createInitialValues = () => {
// //   const initialValues: MemoType[] = [];
// //   const get = () => initialValues;
// //   const set = <MemoType,>(
// //     value: MemoType
// //   ) => {
// //     initialValues.push(value);
// //   };
// //   return { get, set };
// // };

// // export const memosAtom = atomWithStorage("memo", createInitialValues());
// // export const memosAtom = atom<MemoType[]>([]);

// const addMemo = (memos: MemoType[], position: Position) => {
//   return [
//     ...memos,
//     {
//       id: createNewMemoId(),
//       position,
//       text: "",
//     },
//   ];
// };

// const updateMemo = (
//   memos: MemoType[],
//   id: string,
//   position: Position,
//   text: string
// ) => {
//   return memos.map((memo) => {
//     if (memo.id === id) {
//       return {
//         ...memo,
//         position,
//         text,
//       };
//     } else {
//       return memo;
//     }
//   });
// };

// // const updateMemoPosition = (
// //   memos: MemoType[],
// //   id: string,
// //   position: Position
// // ) => {
// //   return memos.map((memo) => {
// //     return {
// //       ...memo,
// //       position: memo.id === id ? position : memo.position,
// //     };
// //   });
// // };

// // const updateMemoString = (memos: MemoType[], id: string, text: string) => {
// //   return memos.map((memo) => {
// //     return {
// //       ...memo,
// //       text: memo.id === id ? text : memo.text,
// //     };
// //   });
// // };

// const removeMemo = (memos: MemoType[], id: string) => {
//   return memos.filter((memo) => memo.id !== id);
// };

// export const newMemo = atom<MemoType>({
//   id: createNewMemoId(),
//   position: {
//     x: 0,
//     y: 0,
//   },
//   text: "",
// });

// export const memosAtom = atom<MemoType[]>([]);
// export const addMemoAtom = atom(
//   () => "",
//   (get, set, { position }: { position: Position }) => {
//     set(memosAtom, addMemo(get(memosAtom), position));
//   }
// );

// export const removeMemoAtom = atom(
//   () => "",
//   (get, set, { id }: { id: string }) => {
//     set(memosAtom, removeMemo(get(memosAtom), id));
//   }
// );

// export const updateMemoAtom = atom(
//   () => "",
//   (
//     get,
//     set,
//     { id, position, text }: { id: string; position: Position; text: string }
//   ) => {
//     set(memosAtom, updateMemo(get(memosAtom), id, position, text));
//   }
// );
