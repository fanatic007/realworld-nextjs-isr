import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { PAGES } from "../../constants";
import { decodeOptions } from "../../middleware";
import { getPath } from "../../pages/home/[path]";


const Pagination = () => {
  const router = useRouter();
  const { tag, page:currentPage=1 } = decodeOptions(router.query.path);
  return(
    <nav>
      <ul className="pagination">
      {
        PAGES.map((page:number) =>
          <li className={`page-item ${page==currentPage?'active':''}`}  key={`page_${page}`}>
            <Link href={`${getPath({tag, page})}`}>
              <a className="page-link">{page}</a>
            </Link>
          </li>        
        )
      }
      </ul>
    </nav>
  );
}

export default Pagination;