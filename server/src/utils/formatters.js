/*eslint-disable no-console  */
import { pick } from 'lodash'

// export const slugify = (val) => {
//   if (!val) return ''
//   return String(val)
//     .normalize('NFKD') // split accented characters into their base characters and diacritical marks
//     .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
//     .trim() // trim leading or trailing whitespace
//     .toLowerCase() // convert to lowercase
//     .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
//     .replace(/\s+/g, '-') // replace spaces with hyphens
//     .replace(/-+/g, '-') // remove consecutive hyphens
// }

/**
   * Example:
   */
// const originalStringTest = 'Lập Trình Viên'
// const slug = slugify(originalStringTest)

// console.log('originalStringTest:', originalStringTest)
// console.log('slug:', slug)
/**
   * Results:
   *
   * Original String Test: 'Lập Trình Viên'
   * Slug Result: lap-trinh-vien
   */

/*
 * Simple method to Convert a String to Slug
 * Các bạn có thể tham khảo thêm kiến thức liên quan ở đây: https://byby.dev/js-slugify-string
@@ -18,3 +20,9 @@ export const slugify = (val) => {
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}
*/

// Lấy một vài dữ liệu cụ thể trong User để tránh việc trả về các dữ liệu nhạy cảm như hash password
export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'username', 'displayName', 'avatar', 'role', 'isActive', 'createdAt', 'updatedAt'])
}