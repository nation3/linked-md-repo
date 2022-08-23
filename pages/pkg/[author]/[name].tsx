import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { tw } from 'twind'
import { getPackage } from '../../../lib/database'
import Link from 'next/link'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { formatAddressOrEnsName } from '../../../lib/ens'

const Package: NextPage = ({ pkg }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {pkg.name ? (
        <>
          <Breadcrumbs author={pkg.author} name={pkg.name} />
          <h3 className={tw`text-2xl my-8`}>All versions</h3>
          <table className={tw`border-collapse table-auto w-full text-sm`}>
            <thead>
              <tr>
                <th
                  className={tw`border-b dark:border-slate-600 font-medium pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left`}
                >
                  Version
                </th>
                <th
                  className={tw`border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left`}
                >
                  URI
                </th>
                <th
                  className={tw`border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left`}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className={tw`bg-white dark:bg-slate-800`}>
              {pkg.versions.map((pkgVersion, i) => (
                <Link
                  href={`/pkg/${pkg.author.ensName || pkg.author.address}/${
                    pkg.name
                  }/${pkgVersion.cid}`}
                  key={i}
                >
                  <tr className={tw`cursor-pointer hover:bg-gray-100`}>
                    <td
                      className={tw`border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400`}
                    >
                      {i}
                    </td>{' '}
                    <td
                      className={tw`border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400`}
                    >
                      {pkgVersion.cid.substring(0, 8)}...
                      {pkgVersion.cid.slice(-8)}
                    </td>
                    <td
                      className={tw`border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400`}
                    >
                      {new Date(pkgVersion.createdAt).toDateString()}
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>Package not found</>
      )}
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const { author, name } = query
  const formattedAuthor = await formatAddressOrEnsName(author)
  if (formattedAuthor.ensName && formattedAuthor.ensName !== author) {
    return {
      redirect: {
        destination: `/pkg/${formattedAuthor.ensName}/${name}`,
        permanent: false,
      },
    }
  }

  let pkg = await getPackage({
    authorAddress: formattedAuthor.address,
    name: query.name,
  })

  pkg.author = formattedAuthor

  return {
    props: { pkg },
  }
}

export default Package