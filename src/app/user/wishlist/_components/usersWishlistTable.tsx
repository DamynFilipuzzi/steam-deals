import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function UsersWishlistTable() {
  const session = await getServerSession(getAuthOptions());

  async function upsertUsersWishlist(
    steamIds: number[],
    userId: string,
  ): Promise<boolean> {
    if (userId === undefined) {
      throw new Error("Invalid userId");
    }

    // Map steamIds to promises and use Promise.all to wait for all of them to complete
    const upsertPromises = steamIds.map(async (steamId) => {
      // Check if UsersWishlist already exists
      const uaExists = await db.usersWishlist.count({
        where: { user_id: userId, steam_id: steamId },
      });

      if (!uaExists) {
        // Check if app exists
        const appExists = await db.apps.count({
          where: { steam_id: steamId },
        });

        if (appExists) {
          // If true, then store UsersWishlist
          await db.usersWishlist.create({
            data: { steam_id: steamId, user_id: userId },
          });
        } else {
          console.log("DNE: ", steamId);
        }
      }
    });

    // Wait for all upsert operations to complete
    await Promise.all(upsertPromises);

    return true;
  }

  if (!session) {
    console.error("failed to retrieve session info");
    // TODO: add toast to let user know an error occurred
    redirect("/");
  } else {
    const steamIds: number[] = [];
    let pageCounter = 0;
    let hasMorePages = true;
    while (hasMorePages) {
      // TODO: LOOP THROUGH wishlist pages
      const response = await fetch(
        `https://store.steampowered.com/wishlist/profiles/${session.user.steam.steamid}/wishlistdata/?p=${pageCounter}`,
      );
      pageCounter++;
      // Failsafe to ensure
      if (pageCounter > 50) {
        return <div>Sorry, something went wrong.. Please try again. </div>;
      }

      if (response.ok) {
        let results = await response.text();
        if (results.length > 2) {
          // Do not remove the following 2 lines. Only purpose's is to ensure the regex removes the final app and exits the loop incase unforeseen error occurs.
          results = results.replace("}}", "},}");
          let counter = 0;
          while (results.length > 2) {
            // Returns wish list app steamID's for the current page.
            const eachID = results.substring(
              results.indexOf('{"') + 2,
              results.indexOf('":{"name":'),
            );
            steamIds.push(Number(eachID));

            results = results.replace(/".*?},/, "");
            counter++;
            // Page size has a maximum of TBD... for now we will assume it is 150. Unfortunately there is little to no documentation and the value seems to vary.
            // Use this to break from an infinite loop incase such issue occurs.
            // TODO: return an error message.
            if (counter > 150) {
              break;
            }
          }
        } else {
          // Break. Reached end of wish list pages
          console.log("Wish List page is empty. Breaking out of loop");
          hasMorePages = false;
        }
      } else {
        // No Wishlist viewable. Might be private. If so return message to user.
        return (
          <div>
            Wish list is private. To view your wish list items please set your
            steam wish list to public
          </div>
        );
      }
    }

    console.log(steamIds);
    console.log(steamIds.length);

    await upsertUsersWishlist(steamIds, session.user.steam.steamid);
    const userWishlist = await api.user.getUserWishlist.query(
      session.user.steam.steamid,
    );

    return (
      <div>
        {userWishlist.map((app) => (
          <Link href={`/game/${app.steam_id}`} key={app.apps.id}>
            <div>{app.apps.title}</div>
          </Link>
        ))}
      </div>
    );
  }
}
