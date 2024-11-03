import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getEvent, getEventOrders } from '@/data'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  let event = await getEvent(params.id)

  return {
    title: event?.name,
  }
}

export default async function Event({ params }) {
  let event = await getEvent(params.id)
  let orders = await getEventOrders(params.id)

  if (!event) {
    notFound()
  }

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Medications Under Analysis
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <Heading>{event.name}</Heading>
          </div>
          <div className="mt-2 text-sm text-zinc-500">{event.summary}</div>
        </div>
        <div className="flex gap-2">
          <Button outline>Edit</Button>
          <Button>View</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-3"></div>
      <Subheading className="mt-12">Recent orders</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Order number</TableHeader>
            <TableHeader>Patient</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.patient.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
